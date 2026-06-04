const HEADERS = ['ID', '이름', '회사', '연락처', '이메일', '문의 유형', '메시지', '상태', '등록일', '수정일'];
const FIELDS = ['id', 'Name', 'Company', 'Phone_Number', 'Email', 'Option', 'Message', 'publishedAt', 'createdAt', 'updatedAt'];

const formatCell = (field: string, value: unknown): string => {
  if (value === null || value === undefined) return '';

  if (field === 'publishedAt') return value ? '발행됨' : '초안';

  if ((field === 'createdAt' || field === 'updatedAt') && value) {
    const d = new Date(value as string);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const toCsv = (rows: Record<string, unknown>[]): string => {
  const header = HEADERS.join(',');
  const body = rows.map((row) =>
    FIELDS.map((f) => formatCell(f, row[f])).join(',')
  );
  return '﻿' + [header, ...body].join('\r\n');
};

export default {
  exportCsv: async (ctx: any) => {
    const entries = await strapi.entityService.findMany(
      'api::contact-submission.contact-submission',
      {
        sort: { createdAt: 'desc' },
        pagination: { limit: -1 },
      }
    );

    const csv = toCsv(entries as Record<string, unknown>[]);
    const filename = `contact-submissions-${new Date().toISOString().slice(0, 10)}.csv`;

    ctx.set('Content-Type', 'text/csv; charset=utf-8');
    ctx.set('Content-Disposition', `attachment; filename="${filename}"`);
    ctx.body = csv;
  },
};
