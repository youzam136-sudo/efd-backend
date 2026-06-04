import type { Core } from '@strapi/strapi';

const escapeCell = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const formatValue = (key: string, value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (key === 'publishedAt') return value ? '발행됨' : '초안';
  if ((key === 'createdAt' || key === 'updatedAt') && value) {
    const d = new Date(value as string);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  if (typeof value === 'object') return escapeCell(JSON.stringify(value));
  return escapeCell(value);
};

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.server.router.get('/api/export/csv', async (ctx: any) => {
      const uid = ctx.query.uid as string;

      if (!uid) {
        ctx.status = 400;
        ctx.body = { error: 'uid 파라미터가 필요합니다' };
        return;
      }

      try {
        const entries = await strapi.entityService.findMany(uid as any, {
          pagination: { limit: -1 },
          sort: { createdAt: 'desc' } as any,
        }) as Record<string, unknown>[];

        if (!entries || entries.length === 0) {
          ctx.set('Content-Type', 'text/csv; charset=utf-8');
          ctx.set('Content-Disposition', `attachment; filename="export.csv"`);
          ctx.body = '﻿데이터가 없습니다';
          return;
        }

        // 첫 번째 항목에서 컬럼 자동 추출 (media, relation 제외)
        const skip = new Set(['documentId', '__component']);
        const columns = Object.keys(entries[0]).filter(k => !skip.has(k) && typeof entries[0][k] !== 'object' || k === 'id' || k === 'publishedAt' || k === 'createdAt' || k === 'updatedAt');

        const header = columns.join(',');
        const rows = entries.map(row =>
          columns.map(col => formatValue(col, row[col])).join(',')
        );

        const collectionName = uid.split('.').pop() ?? 'export';
        const filename = `${collectionName}-${new Date().toISOString().slice(0, 10)}.csv`;

        ctx.set('Content-Type', 'text/csv; charset=utf-8');
        ctx.set('Content-Disposition', `attachment; filename="${filename}"`);
        ctx.body = '﻿' + [header, ...rows].join('\r\n');
      } catch (e: any) {
        ctx.status = 400;
        ctx.body = { error: e.message };
      }
    });
  },
  bootstrap() {},
};
