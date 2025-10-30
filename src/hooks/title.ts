export default function useTitle(empresa: string, title: string) {
    document.title = `${empresa} | ${title}`;
}