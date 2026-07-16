import { ResponseFactory, ERROR_CODES } from '../../src/shared/response/response.factory';

describe('ResponseFactory', () => {
  it('ok() returns success envelope', () => {
    const res = ResponseFactory.ok({ id: 1 }, { page: 1 });
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ id: 1 });
    expect(res.meta).toEqual({ page: 1 });
  });

  it('error() returns error envelope with code', () => {
    const res = ResponseFactory.error(ERROR_CODES.NOT_FOUND.code, 'missing');
    expect(res.success).toBe(false);
    expect(res.error.code).toBe('NOT_FOUND');
    expect(res.error.message).toBe('missing');
  });

  it('ok() handles null data', () => {
    const res = ResponseFactory.ok(null);
    expect(res.success).toBe(true);
    expect(res.data).toBeNull();
  });
});
