export interface IProps {
    initialValue: string,
}

export interface INavProps {
    setValue: (str: string) => void,
    editorElement: HTMLTextAreaElement,
    setLoading: (bool: boolean) => void,
    preview: boolean,
    setPreview: (bool: boolean) => void,
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
    ctrlB = 66,
    ctrlI = 73,
    shift9 = 57,
    shiftArrayBracket = 219,
    oneMark = 222,
    tab = 9,
    enter = 13,
}
