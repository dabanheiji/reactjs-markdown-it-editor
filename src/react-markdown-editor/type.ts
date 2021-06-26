export interface IProps {
    initialValue: string,
}

export interface INavProps {
    value: string,
    setValue: (str: string) => void,
    editorElement: HTMLTextAreaElement,
    setLoading: (bool: boolean) => void
}

export interface IHistory {
    value: string,
    pre: null | IHistory,
    next: null | IHistory,
    selectionStart: number,
    selectionEnd: number
}

export enum IKeyCodeMap {
    ctrlZ = 90,
    ctrlY = 89,
    tab = 9,
}
