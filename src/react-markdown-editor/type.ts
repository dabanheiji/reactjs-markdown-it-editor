export interface IProps {
    value: string,
    setValue: (str: string) => void,
    editorElement: HTMLTextAreaElement,
    setLoading: (bool: boolean) => void
}
