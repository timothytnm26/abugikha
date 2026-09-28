import { queryOptions } from "@tanstack/react-query";
import { CONSONANTS, INITIAL_UNITS } from "@abugikha/core/consonant";

/**
 * Dữ liệu hiện đóng gói sẵn trong @abugikha/core và dùng làm `initialData`: hiển thị ngay,
 * không nhúng thêm bản sao vào HTML. Khi chuyển sang API, chỉ cần đổi `queryFn`
 * (và hạ `staleTime`); dữ liệu đóng gói vẫn là bản dự phòng khi offline.
 */
export const consonantQueries = {
  all: () =>
    queryOptions({ queryKey: ["consonants"], queryFn: async () => CONSONANTS, initialData: CONSONANTS, staleTime: Infinity }),
  initials: () =>
    queryOptions({ queryKey: ["initial-units"], queryFn: async () => INITIAL_UNITS, initialData: INITIAL_UNITS, staleTime: Infinity }),
};
