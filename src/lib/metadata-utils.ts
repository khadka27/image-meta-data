/**
 * Generates a standard device-default filename based on camera make, model, original date, index, and extension.
 */
export function getDeviceDefaultFileName(
  make: string | undefined,
  model: string | undefined,
  dateTimeOriginal: string | undefined,
  index: number,
  ext: string
): string {
  const cleanExt = ext.toLowerCase();
  
  // Normalize make/model
  const lowerMake = String(make || "").toLowerCase();
  const lowerModel = String(model || "").toLowerCase();
  
  // Try to parse DateTimeOriginal (EXIF format: YYYY:MM:DD HH:MM:SS)
  let baseDate = new Date();
  if (dateTimeOriginal) {
    // Convert YYYY:MM:DD HH:MM:SS to YYYY-MM-DDTHH:MM:SS
    const parts = dateTimeOriginal.trim().split(" ");
    if (parts.length === 2) {
      const datePart = parts[0].replace(/:/g, "-");
      const timePart = parts[1];
      const parsedDate = new Date(`${datePart}T${timePart}`);
      if (!isNaN(parsedDate.getTime())) {
        baseDate = parsedDate;
      }
    }
  }

  // To prevent filename collisions and look realistic, increment date by index seconds
  const photoDate = new Date(baseDate.getTime() + index * 1000);

  // Format date helper: YYYYMMDD_HHMMSS
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = photoDate.getFullYear();
  const mm = pad(photoDate.getMonth() + 1);
  const dd = pad(photoDate.getDate());
  const hh = pad(photoDate.getHours());
  const min = pad(photoDate.getMinutes());
  const ss = pad(photoDate.getSeconds());
  const timestamp = `${yyyy}${mm}${dd}_${hh}${min}${ss}`;

  // Match brand
  if (lowerMake.includes("apple") || lowerModel.includes("iphone")) {
    const num = String(index + 1).padStart(4, "0");
    return `IMG_${num}.${cleanExt}`;
  }
  
  if (lowerMake.includes("samsung") || lowerModel.includes("galaxy")) {
    return `${timestamp}.${cleanExt}`;
  }
  
  if (lowerMake.includes("google") || lowerModel.includes("pixel")) {
    // Pixel usually has 9 digits for milliseconds, let's append three digits (e.g. 000 + index)
    const ms = String(index).padStart(3, "0");
    return `PXL_${timestamp}${ms}.${cleanExt}`;
  }

  if (lowerMake.includes("sony") || lowerModel.includes("ilce") || lowerMake.includes("nikon") || lowerMake.includes("fujifilm")) {
    const num = String(index + 1).padStart(4, "0");
    return `DSC_${num}.${cleanExt}`;
  }

  // Default fallback
  const num = String(index + 1).padStart(4, "0");
  return `IMG_${num}.${cleanExt}`;
}
