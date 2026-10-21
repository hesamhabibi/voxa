export async function readApiResponse<T>(response: Response): Promise<T & { message?: string }> {
  const text = await response.text()
  if (!text) return { message: "پاسخ معتبری از سرور دریافت نشد." } as T & { message?: string }
  try { return JSON.parse(text) as T & { message?: string } }
  catch { return { message: "پاسخ سرور قابل‌خواندن نیست." } as T & { message?: string } }
}
