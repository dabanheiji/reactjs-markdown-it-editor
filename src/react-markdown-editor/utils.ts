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
    setValue(value)
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
    setValue(value)
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
    setValue(value)
}

/**
 * 添加超链接
 * @param el HTMLTextAreaElement
 * @param setValue (str: string) => void): void
 */
export const addLink = (el: HTMLTextAreaElement, setValue: (str: string) => void): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end 
        ? `${el.value.slice(0, start)}\n [链接文字](http://dabanheiji.com) \n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}[${el.value.slice(start, end)}](http://dabanheiji.com)${el.value.slice(end)}`;
    setValue(value);
}

/**
 * 添加图片
 * @param el HTMLTextAreaElement
 * @param setValue (str: string) => void): void
 */
export const addPhoto = (el: HTMLTextAreaElement, setValue: (str: string)=>void): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end 
        ? `${el.value.slice(0, start)}\n ![image](http://cpyfiles.dabanheiji.com/2021_04_05_08_15_51179858reactjs.png) \n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}![${el.value.slice(start, end)}](http://cpyfiles.dabanheiji.com/2021_04_05_08_15_51179858reactjs.png)${el.value.slice(end)}`;
    setValue(value);
}

/**
 * 添加表格
 * @param el HTMLTextAreaElement
 * @param setValue (str: string)=>void
 * @param row number
 * @param col number
 */
export const addTable = (el: HTMLTextAreaElement,setValue: (str: string)=>void, row: number = 2, col: number = 2): void => {
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
    console.log(tableStr)
    let value = `${el.value.slice(0, start)}\n${tableStr}\n${el.value.slice(end)}`
    setValue(value)
}