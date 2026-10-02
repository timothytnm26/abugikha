'use client';
import { useRouter } from 'next/navigation';
import { CONSONANT_BY_ID, INITIAL_BY_ID } from '@/entities/consonant';
import { vowelFitsInitial } from '@/entities/vowel';
import { useBuilderStore } from '@/features/build-syllable';
import { useLocalePath, useT } from '@/shared/i18n';
import { Tape, hashSeed } from '@/shared/ui';
import type { Selected } from './selection';
import { selectionTileColor } from './tiles';

const selectionKey = (sel: Selected) => `${sel.kind}:${'char' in sel.item ? sel.item.char : sel.item.id}`;

/**
 * Nút thử trong Ghép chữ, dán như một miếng băng keo xéo 30–60° ở lề phải khung preview, đầu dính lòi ra ngoài.
 * Đặt ngoài vùng cuộn của khung nên không bị cắt.
 */
export function SelectionActions({ sel, className }: { sel: Selected; className?: string }) {
  const t = useT();
  const router = useRouter();
  const href = useLocalePath();
  const setPart = useBuilderStore((s) => s.setPart);
  const color = selectionTileColor(sel).color;
  const go = () => router.push(href('/lab'));

  let tryLabel: string | undefined;
  let onTry: (() => void) | undefined;
  switch (sel.kind) {
    case 'consonant': {
      const { item } = sel;
      if (INITIAL_BY_ID.has(item.char)) {
        tryLabel = t.aksornthai.tryIt;
        onTry = () => {
          setPart('initial', item.char);
          go();
        };
      }
      break;
    }
    case 'initial': {
      const { item } = sel;
      tryLabel = t.aksornthai.tryIt;
      onTry = () => {
        setPart('initial', item.id);
        go();
      };
      break;
    }
    case 'vowel': {
      const { item } = sel;
      tryLabel = t.aksornthai.tryVowel;
      onTry = () => {
        const state = useBuilderStore.getState();
        const currentInitial = INITIAL_BY_ID.get(state.initialId)!;
        const currentFinal = state.finalId ? CONSONANT_BY_ID.get(state.finalId) : null;
        if (!vowelFitsInitial(item, currentInitial.chars)) setPart('initial', 'ก');
        if (currentFinal && (!item.closed || item.excludeFinals?.includes(currentFinal.char))) setPart('final', null);
        setPart('vowel', item.id);
        go();
      };
      break;
    }
    case 'tone': {
      const { item } = sel;
      tryLabel = t.aksornthai.tryMark;
      onTry = () => {
        setPart('mark', item.id);
        go();
      };
      break;
    }
  }

  return <div className={className}>{onTry && tryLabel && <Tape pinned onClick={onTry} color={color} seed={hashSeed(selectionKey(sel), 2)} angle={20 - (hashSeed(selectionKey(sel), 2) % 31)}>
          {tryLabel} →
        </Tape>}</div>;
}
