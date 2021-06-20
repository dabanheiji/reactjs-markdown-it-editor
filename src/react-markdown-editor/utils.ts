/**
 * 获取输入框选中文本的开始与结束的下标
 * @param el HTMLTextAreaElement
 * @returns number[]
 */
export const getCursorPosition = (el: HTMLTextAreaElement): number[] => {
    const { selectionStart, selectionEnd } = el
    return [selectionStart, selectionEnd]
}

/**
 * 获取焦点，并设置选中的文本
 * 
 * @param el HTMLTextAreaElement
 * @param selectionStart number
 * @param selectionEnd number
 */
export const setSelectionRange = (el: HTMLTextAreaElement, selectionStart: number, selectionEnd: number): void => {
    let timer = setTimeout(()=>{
        let { scrollTop } = el;
        el.focus();
        el.scrollTop = scrollTop;
        el.setSelectionRange(selectionStart, selectionEnd)
        timer && clearInterval(timer)
    }, 0)
}

/**
 * 添加加粗、斜体、中划线的方法
 * @param el HTMLTextAreaElement
 * @param symbol string
 * @param txt string
 * @param setValue (str: string)=>void
 */
export const handleText = (el: HTMLTextAreaElement, symbol: string, txt: string, setValue: (str: string)=>void): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end 
        ? `${el.value.slice(0, start)}\n${symbol}${txt}${symbol}\n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}${symbol}${el.value.slice(start, end)}${symbol}${el.value.slice(end)}`;
    let selectionStart = start === end ? start + symbol.length + 1 : start + symbol.length;
    let selectionEnd = start === end ? selectionStart + txt.length : end + symbol.length;
    setValue(value)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加标题
 * @param el HTMLTextAreaElement
 * @param symbol string
 * @param txt string
 * @param setValue (str: string)=>void
 */
export const addTitle = (el: HTMLTextAreaElement, symbol: string, txt: string, setValue: (str: string)=>void): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end
        ? `${el.value.slice(0, start)}\n${symbol} ${txt}\n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}\n${symbol} ${el.value.slice(start, end)}\n${el.value.slice(end)}`;
    let selectionStart = start + symbol.length + 2;
    let selectionEnd = start === end ? selectionStart + txt.length : end + symbol.length + 1
    setValue(value)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加有序列表、无序列表
 * @param el HTMLTextAreaElement
 * @param symbol string
 * @param txt string
 * @param setValue (str: string)=>void
 */
export const addList = (el: HTMLTextAreaElement, symbol: string, setValue: (str: string) => void): void => {
    const [start, end] = getCursorPosition(el)
    let activeStart: number = start, flag: boolean = start === end;
    activeStart = el.value.slice(0, start).lastIndexOf('\n') === -1 ? 0 : el.value.slice(0, start).lastIndexOf('\n')
    activeStart = activeStart === 0 ? 0 : activeStart + 1
    
    let value = flag
        ? `${el.value.slice(0, activeStart)}${symbol} ${el.value.slice(activeStart)}`
        : `${el.value.slice(0, activeStart)}${symbol} ${el.value.slice(activeStart, end).replace(/\n/g, `\n${symbol} `)}${el.value.slice(end)}`
    let selectionStart = activeStart + symbol.length + 1;
    let selectionEnd = selectionStart;
    setValue(value)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加超链接
 * @param el HTMLTextAreaElement
 * @param setValue (str: string) => void): void
 */
export const addLink = (el: HTMLTextAreaElement, setValue: (str: string) => void): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end 
        ? `${el.value.slice(0, start)}[链接文字](url)${el.value.slice(end)}`
        : `${el.value.slice(0, start)}[${el.value.slice(start, end)}](url)${el.value.slice(end)}`;
    let selectionStart = start === end ? start + 7 : end + 3;
    let selectionEnd = start === end ? end + 10 : end + 6;
    setValue(value);
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加图片
 * @param el HTMLTextAreaElement
 * @param setValue (str: string) => void): void
 */
export const addPhoto = (el: HTMLTextAreaElement, setValue: (str: string)=>void): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end 
        ? `${el.value.slice(0, start)}\n![image](url)\n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}\n![${el.value.slice(start, end)}](url)\n${el.value.slice(end)}`;
    let selectionStart = start === end ? start + 10 : end + 5;
    let selectionEnd = start === end ? end + 13 : end + 8;
    setValue(value);
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加表格
 * @param el HTMLTextAreaElement
 * @param setValue (str: string)=>void
 * @param row number
 * @param col number
 */
export const addTable = (el: HTMLTextAreaElement,setValue: (str: string)=>void, row: number = 2, col: number = 3): void => {
    const [start, end] = getCursorPosition(el);
    let tableStr: string = ``;
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            let value = (i === 0 && j === 0) ? (start === end ? `${i+1}-${j+1}` : `${el.value.slice(start, end)}`) : `${i+1}-${j+1}`
            tableStr += j === col - 1 ? `|${value}|` : `|${value}`;
        }
        tableStr += `\n`
        if(i === 0){
            for(let j = 0; j < col; j++){
                tableStr += j === col - 1 ? `|-|` : `|-`
            }
            tableStr += `\n`
        }
    }
    let value = `${el.value.slice(0, start)}\n${tableStr}\n${el.value.slice(end)}`
    let selectionStart = start + 2;
    let selectionEnd = start === end ? selectionStart + 3 : selectionStart + end - start;
    setValue(value)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加代码块
 * @param el HTMLTextAreaElement
 * @param setValue (str: string)=>void
 */
export const addCode = (el: HTMLTextAreaElement, setValue: (str: string)=>void): void => {
    const [start, end] = getCursorPosition(el);
    let value = start === end 
        ? `${el.value.slice(0, start)}\n\`\`\`\n\n\`\`\`\n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}\n\`\`\`\n${el.value.slice(start, end)}\n\`\`\`\n${el.value.slice(end)}`
    let selectionStart = start + 5;
    let selectionEnd = selectionStart;
    setValue(value)
    setSelectionRange(el, selectionStart, selectionEnd)
}