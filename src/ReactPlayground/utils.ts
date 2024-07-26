export function fileName2Language(fileName: string) {
  const suffix = fileName.split(".").pop();
  switch (suffix) {
    case "js":
    case "jsx":
      return "javascript";

    case "ts":
    case "tsx":
      return "typescript";

    case "css":
      return "css";

    case "json":
      return "json";

    default:
      return "javascript";
  }
}
