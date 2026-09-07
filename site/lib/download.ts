export function downloadText(
  text: string,
  name: string,
  type: string,
): boolean {
  let url: string | undefined;
  try {
    url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    try {
      link.click();
    } finally {
      link.remove();
    }
    return true;
  } catch {
    return false;
  } finally {
    if (url) setTimeout(() => URL.revokeObjectURL(url!), 1000);
  }
}
