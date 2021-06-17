export const getCursorPosition = (el: HTMLTextAreaElement): number[] => {
    const { selectionStart, selectionEnd } = el
    return [selectionStart, selectionEnd]
}

export const handleText = (el: HTMLTextAreaElement, symbol: string, txt: string, setValue: (str: string)=>void): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end 
        ? `${el.value.slice(0, start)}\n${symbol}${txt}${symbol}\n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}${symbol}${el.value.slice(start, end)}${symbol}${el.value.slice(end)}`
    setValue(value)
}