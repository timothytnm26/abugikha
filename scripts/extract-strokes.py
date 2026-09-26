# Tạo src/entities/writing/model/strokes.json từ font Noto Sans Thai Looped.
# Cần: pip install numpy pillow scikit-image scipy; tải SansLooped.ttf (google/fonts: ofl/notosansthailooped) vào cùng thư mục.
# Chạy: python3 extract-strokes.py  → strokes.json
import json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from skimage.morphology import skeletonize
from scipy import ndimage as ndi

EM = 800                     # px per em khi render
FONT = ImageFont.truetype("SansLooped.ttf", EM)
BASE_Y, ORIGIN_X, W, H = 1050, 250, 1500, 1450
S = 1000 / EM                # px → đơn vị font (1000/em)
CHARS = list("กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ") + list("๐๑๒๓๔๕๖๗๘๙")
HEAD_TOP_LEFT = set("ษ")
N8 = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]

def render(ch):
    im = Image.new("L", (W, H), 0)
    ImageDraw.Draw(im).text((ORIGIN_X, BASE_Y), ch, font=FONT, fill=255, anchor="ls")
    return np.array(im) > 127

def graph(skel):
    pts = set(zip(*np.nonzero(skel)))
    nb = lambda p: [(p[0]+dy, p[1]+dx) for dy, dx in N8 if (p[0]+dy, p[1]+dx) in pts]
    deg = {p: len(nb(p)) for p in pts}
    nodepix = {p for p in pts if deg[p] != 2}
    # gom các pixel nút kề nhau thành một nút
    cluster, nodes = {}, []
    for p in nodepix:
        if p in cluster: continue
        stack, comp = [p], []
        cluster[p] = len(nodes)
        while stack:
            q = stack.pop(); comp.append(q)
            for r in nb(q):
                if r in nodepix and r not in cluster:
                    cluster[r] = len(nodes); stack.append(r)
        nodes.append(np.mean(comp, axis=0))
    edges, used = [], set()
    def trace(a, b):
        path, prev, cur = [a, b], a, b
        while cur not in nodepix:
            nxt = [r for r in nb(cur) if r != prev and r not in path[-3:]]
            if not nxt: break
            prev, cur = cur, nxt[0]
            if cur == path[0]: path.append(cur); break
            path.append(cur)
        return path
    for p in nodepix:
        for q in nb(p):
            if (p, q) in used: continue
            if q in nodepix:
                if cluster[q] != cluster[p]:
                    used.add((p, q)); used.add((q, p))
                    edges.append([cluster[p], cluster[q], [p, q]])
                continue
            path = trace(p, q)
            used.add((p, q)); used.add((path[-1], path[-2]))
            end = cluster.get(path[-1])
            if end is None: continue
            edges.append([cluster[p], end, path])
    # vòng khép kín không có nút (vd. ๐)
    seen = {px for e in edges for px in e[2]}
    rest = [p for p in pts if p not in seen and p not in nodepix]
    while rest:
        p = rest[0]; nodes.append(np.array(p, float)); nid = len(nodes) - 1
        q = nb(p)[0]; path = [p, q]; prev, cur = p, q
        while True:
            nxt = [r for r in nb(cur) if r != prev]
            if not nxt or nxt[0] == p: break
            prev, cur = cur, nxt[0]; path.append(cur)
        path.append(p)
        edges.append([nid, nid, path])
        seen |= set(path); rest = [r for r in rest if r not in seen]
    return nodes, edges

def degree(edges, n):
    return sum((e[0] == n) + (e[1] == n) for e in edges)

def simplify_graph(nodes, edges, spur):
    changed = True
    while changed:
        changed = False
        # cắt gai: cạnh có một đầu cụt, ngắn, đầu kia là chỗ rẽ nhánh
        for e in list(edges):
            a, b, path = e
            if a == b: continue
            da, db = degree(edges, a), degree(edges, b)
            if len(path) < spur and ((da == 1 and db >= 3) or (db == 1 and da >= 3)):
                edges.remove(e); changed = True
        # gộp các nút chỉ còn 2 cạnh
        for n in range(len(nodes)):
            inc = [e for e in edges if n in (e[0], e[1])]
            if len(inc) == 2 and inc[0] is not inc[1] and inc[0][0] != inc[0][1] and inc[1][0] != inc[1][1]:
                e1, e2 = inc
                p1 = e1[2] if e1[1] == n else e1[2][::-1]; s1 = e1[0] if e1[1] == n else e1[1]
                p2 = e2[2] if e2[0] == n else e2[2][::-1]; s2 = e2[1] if e2[0] == n else e2[0]
                edges.remove(e1); edges.remove(e2)
                edges.append([s1, s2, p1 + p2[1:]]); changed = True
                break
    return edges

def holes(mask):
    lab, n = ndi.label(~mask)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    out = []
    for i in range(1, n + 1):
        if i in border: continue
        ys, xs = np.nonzero(lab == i)
        out.append({"area": len(ys), "c": (ys.mean(), xs.mean()), "r": math.sqrt(len(ys) / math.pi)})
    return out

def direction(path, at_start, k=12):
    seg = path[:k] if at_start else path[::-1][:k]
    (y0, x0), (y1, x1) = seg[0], seg[-1]
    return math.atan2(y1 - y0, x1 - x0)

def walk(nodes, edges, start, head_edges, max_retrace):
    """Đi bút: ưu tiên vòng đầu, sau đó chọn cạnh đi thẳng nhất; hết đường thì nhấc bút."""
    left = list(range(len(edges)))
    strokes, cur, heading, stroke, history = [], start, None, [], []
    while left:
        cand = []
        for i in left:
            a, b, path = edges[i]
            for at_start, other in ((True, b), (False, a)):
                if (a if at_start else b) != cur: continue
                d = direction(path, at_start)
                turn = 0 if heading is None else abs((d - heading + math.pi) % (2 * math.pi) - math.pi)
                cand.append((0 if i in head_edges else 1, turn, i, at_start, other))
        if not cand:
            # Đầu cụt: nếu chỗ rẽ phía sau còn nét chưa viết thì đi ngược lại nét cũ (không nhấc bút)
            # lùi lại tối đa ~6 lần độ dày nét để tới chỗ rẽ còn nét chưa viết
            back, total = [], 0
            # lùi đúng một đoạn: không giới hạn độ dài (vd. chóp thân phải của น ม ห)
            if history and any(history[-1][0] in edges[i][:2] for i in left):
                history_iter = [history[-1]]
            else:
                history_iter = list(reversed(history))
            for node, path in history_iter:
                back.append((node, path)); total += len(path)
                if len(history_iter) > 1 and total > max_retrace: back = []; break
                if any(node in edges[i][:2] for i in left): break
            else:
                back = []
            if back:
                for node, path in back:
                    stroke += path[::-1][1:]
                    heading = direction(path[::-1], False) + math.pi
                    heading = math.atan2(math.sin(heading), math.cos(heading))
                    cur = node; history.pop()
                continue
            history.clear()
            if stroke: strokes.append(stroke)
            stroke, heading = [], None
            # nhấc bút: sang đầu cạnh chưa vẽ gần nhất
            last = np.array(strokes[-1][-1]) if strokes else nodes[start]
            best = min(((np.linalg.norm(nodes[edges[i][j]] - last), edges[i][j]) for i in left for j in (0, 1)))
            cur = best[1]; continue
        _, _, i, at_start, other = min(cand)
        path = edges[i][2] if at_start else edges[i][2][::-1]
        stroke += path if not stroke else path[1:]
        history.append((cur, path))
        heading = direction(path, False) + math.pi  # hướng ra ở cuối cạnh
        heading = math.atan2(math.sin(heading), math.cos(heading))
        cur = other; left.remove(i)
    if stroke: strokes.append(stroke)
    return strokes

def smooth(pts, k=4):
    a = np.array(pts, float)
    if len(a) < 2 * k + 1: return a
    closed = np.linalg.norm(a[0] - a[-1]) < 2
    pad = np.concatenate([a[-k-1:-1], a, a[1:k+1]]) if closed else np.concatenate([np.repeat(a[:1], k, 0), a, np.repeat(a[-1:], k, 0)])
    ker = np.ones(2 * k + 1) / (2 * k + 1)
    out = np.stack([np.convolve(pad[:, i], ker, "valid") for i in range(2)], 1)
    out[0], out[-1] = a[0], a[-1]
    return out

def rdp(a, eps):
    if len(a) < 3: return a
    s, e = a[0], a[-1]; v = e - s; L = np.linalg.norm(v)
    d = np.abs(np.cross(v, a - s)) / L if L else np.linalg.norm(a - s, axis=1)
    i = int(np.argmax(d))
    if d[i] > eps: return np.concatenate([rdp(a[:i + 1], eps)[:-1], rdp(a[i:], eps)])
    return np.array([s, e])

result, report = {}, []
for ch in CHARS:
    mask = render(ch)
    dist = ndi.distance_transform_edt(mask)
    skel = skeletonize(mask)
    width = 2 * float(np.median(dist[skel]))
    nodes, edges = graph(skel)
    edges = simplify_graph(nodes, edges, spur=int(width * 1.3))
    hs = [h for h in holes(mask) if h["area"] < mask.sum() * 0.6]
    small = [h for h in hs if h["r"] < width * 2.2]
    # Đầu tròn = lỗ lớn nhất trong các lỗ nhỏ (đuôi cong nhỏ hơn đầu). Ngoại lệ: ษ có vòng giữa to hơn đầu
    if ch in HEAD_TOP_LEFT and small:
        head = min(small, key=lambda h: h["c"][0] + h["c"][1])
    else:
        head = max(small, key=lambda h: h["area"]) if small else None
    if head:
        hc = np.array(head["c"])
        # cạnh thuộc vòng đầu: mọi điểm đều gần tâm lỗ
        dmax = [max(np.linalg.norm(np.array(e[2]) - hc, axis=1)) for e in edges]
        # chỉ các cạnh ôm sát quanh lỗ đầu tròn (không lấy đoạn nối sang thân chữ)
        head_edges = {i for i, d in enumerate(dmax) if d < head["r"] + width * 1.25} or {int(np.argmin(dmax))}
        cand = {n for i in head_edges for n in edges[i][:2]} or set(range(len(nodes)))
        start = min(cand, key=lambda n: np.linalg.norm(nodes[n] - hc))
    else:
        head_edges = set()
        ends = [n for n in range(len(nodes)) if degree(edges, n) == 1] or list(range(len(nodes)))
        start = min(ends, key=lambda n: (nodes[n][1], nodes[n][0]))  # đầu cụt bên trái nhất
    strokes = walk(nodes, edges, start, head_edges, max_retrace=int(width * 6))
    ys, xs = np.nonzero(mask); cx = (xs.min() + xs.max()) / 2
    to_font = lambda p: [round((p[1] - cx) * S, 1), round((p[0] - BASE_Y) * S, 1)]
    out = []
    for st in strokes:
        a = rdp(smooth(st), 0.8)
        out.append("M" + " L".join(f"{x} {y}" for x, y in map(to_font, a)))
    result[ch] = {"strokes": out, "width": round(width * S, 1),
                  "head": to_font(head["c"]) if head else None}
    report.append(f"{ch}:{len(strokes)}")
top = lambda ch: float(np.nonzero(render(ch))[0].min())
meta = {"y0": round((min(np.nonzero(render(c))[0].min() for c in CHARS) - BASE_Y) * S - 10, 1),
        "y1": round((max(np.nonzero(render(c))[0].max() for c in CHARS) - BASE_Y) * S + 10, 1),
        "maxW": round(max((lambda m: (np.nonzero(m)[1].max() - np.nonzero(m)[1].min()))(render(c)) for c in CHARS) * S + 20, 1),
        "xh": round((top("ก") - BASE_Y) * S, 1)}
json.dump({"meta": meta, "glyphs": result}, open("strokes.json", "w"), ensure_ascii=False)
print(meta); print(" ".join(report))
import os; print("size", os.path.getsize("strokes.json"))
