/**
 * 获取输入框选中文本的开始与结束的下标
 * @param {HTMLTextAreaElement} el 
 * @returns {number[]}
 */
export const getCursorPosition = (el: HTMLTextAreaElement): number[] => {
    const { selectionStart, selectionEnd } = el
    return [selectionStart, selectionEnd]
}

/**
 * 处理尾部多余的换行符
 * @param {string} str 
 * @returns {string}
 */
export const clearEndNullText = (str: string): string => {
    let arr = str.split('\n').reverse();
    let index = arr.findIndex(item => item.length > 0) - 1;
    arr.splice(0, index);
    return arr.reverse().join('\n');
}

/**
 * 获取焦点，并设置选中的文本
 * @param {HTMLTextAreaElement} el 
 * @param {number} selectionStart 
 * @param {number} selectionEnd 
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
 * @param {HTMLTextAreaElement} el 
 * @param {string} symbol 
 * @param {string} txt 
 * @param {Function} setValue 
 */
export const handleText = (el: HTMLTextAreaElement, symbol: string, txt: string, setValue: Function): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end 
        ? `${el.value.slice(0, start)}\n${symbol}${txt}${symbol}\n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}${symbol}${el.value.slice(start, end)}${symbol}${el.value.slice(end)}`;
    let selectionStart = start === end ? start + symbol.length + 1 : start + symbol.length;
    let selectionEnd = start === end ? selectionStart + txt.length : end + symbol.length;
    value = clearEndNullText(value)
    setSelectionRange(el, selectionStart, selectionEnd)
    setValue(value, selectionStart, selectionEnd)
}

/**
 * 添加标题
 * @param {HTMLTextAreaElement} el 
 * @param {string} symbol 
 * @param {string} txt 
 * @param {Function} setValue 
 */
export const addTitle = (el: HTMLTextAreaElement, symbol: string, txt: string, setValue: Function): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end
        ? `${el.value.slice(0, start)}\n${symbol} ${txt}\n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}\n${symbol} ${el.value.slice(start, end)}\n${el.value.slice(end)}`;
    let selectionStart = start + symbol.length + 2;
    let selectionEnd = start === end ? selectionStart + txt.length : end + symbol.length + 1;
    value = clearEndNullText(value)
    setValue(value, selectionStart, selectionEnd)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加有序列表、无序列表, tab缩进
 * @param {HTMLTextAreaElement} el 
 * @param {string} symbol 
 * @param {string} txt 
 * @param {Function} setValue 
 * @param {1 | 2} type  1: 有序、无序列表  2: 其他，如tab缩进
 */
export const addList = (el: HTMLTextAreaElement, symbol: string, setValue: Function, type: 1 | 2 = 1): void => {
    const [start, end] = getCursorPosition(el)
    let paragraph: string[] = el.value.split('\n'),
        activeStart: number = start, 
        flag: boolean = start === end, 
        value: string = ``,
        selectionStart: number = start,
        selectionEnd: number = end,
        len: number = paragraph.length,
        stringCount:number = 0,
        addSpaceCount: number = 0;

    activeStart = el.value.slice(0, start).lastIndexOf('\n') === -1 ? 0 : el.value.slice(0, start).lastIndexOf('\n')
    activeStart = activeStart === 0 ? 0 : activeStart + 1;

    if(flag){
        if(type === 1){
            value = `${el.value.slice(0, activeStart)}${symbol}${el.value.slice(activeStart)}`
        }else if(type === 2){
            value = `${el.value.slice(0, start)}${symbol}${el.value.slice(end)}`
        }
        selectionStart += symbol.length;
        selectionEnd += symbol.length;
    }else{
        for(let i = 0; i < len; i++){
            let item = paragraph[i],
                nextStringCount =  stringCount + item.length + 1;

            if(nextStringCount > start && stringCount < end){
                let newItem = `${symbol}${item}`;
                addSpaceCount += symbol.length;
                paragraph[i] = newItem;
                if(start > stringCount) selectionStart += symbol.length;
                if(nextStringCount > end) selectionEnd += addSpaceCount;
            }else if(stringCount > end){
                break;
            }

            stringCount = nextStringCount;
        }

        value = paragraph.join('\n')
    }
    value = clearEndNullText(value);
    setValue(value, selectionStart, selectionEnd)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加超链接
 * @param {HTMLTextAreaElement} el 
 * @param {Function} setValue 
 */
export const addLink = (el: HTMLTextAreaElement, setValue: Function): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end 
        ? `${el.value.slice(0, start)}[链接文字](url)${el.value.slice(end)}`
        : `${el.value.slice(0, start)}[${el.value.slice(start, end)}](url)${el.value.slice(end)}`;
    let selectionStart = start === end ? start + 7 : end + 3;
    let selectionEnd = start === end ? end + 10 : end + 6;
    value = clearEndNullText(value)
    setValue(value, selectionStart, selectionEnd)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加图片
 * @param {HTMLTextAreaElement} el 
 * @param {Function} setValue 
 */
export const addPhoto = (el: HTMLTextAreaElement, setValue: Function): void => {
    const [start, end] = getCursorPosition(el)
    let value = start === end 
        ? `${el.value.slice(0, start)}\n![image](url)\n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}\n![${el.value.slice(start, end)}](url)\n${el.value.slice(end)}`;
    let selectionStart = start === end ? start + 10 : end + 5;
    let selectionEnd = start === end ? end + 13 : end + 8;
    value = clearEndNullText(value)
    setValue(value, selectionStart, selectionEnd)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加表格
 * @param {HTMLTextAreaElement} el 
 * @param {Function} setValue 
 * @param {number} row 
 * @param {number} col 
 */
export const addTable = (el: HTMLTextAreaElement,setValue: Function, row: number = 2, col: number = 3): void => {
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
                tableStr += j === col - 1 ? `| -- |` : `| -- `
            }
            tableStr += `\n`
        }
    }
    let value = `${el.value.slice(0, start)}\n${tableStr}\n${el.value.slice(end)}`
    let selectionStart = start + 2;
    let selectionEnd = start === end ? selectionStart + 3 : selectionStart + end - start;
    value = clearEndNullText(value)
    setValue(value, selectionStart, selectionEnd)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 添加代码块
 * @param {HTMLTextAreaElement} el 
 * @param {Function} setValue 
 */
export const addCode = (el: HTMLTextAreaElement, setValue: Function): void => {
    const [start, end] = getCursorPosition(el);
    let value = start === end 
        ? `${el.value.slice(0, start)}\n\`\`\`\n\n\`\`\`\n${el.value.slice(end)}`
        : `${el.value.slice(0, start)}\n\`\`\`\n${el.value.slice(start, end)}\n\`\`\`\n${el.value.slice(end)}`
    let selectionStart = start + 5;
    let selectionEnd = selectionStart;
    value = clearEndNullText(value)
    setValue(value, selectionStart, selectionEnd)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * shift + tab 清除段落最开始的空字符
 * @param {HTMLTextAreaElement} el 
 * @param {number} tabSpaceCount 
 * @param {Function} setValue 
 */
export const cancelTabSpace = (el: HTMLTextAreaElement, tabSpaceCount: number, setValue: Function): void => {
    const [start, end] = getCursorPosition(el);
    let paragraph: string[] = el.value.split('\n'),
        selectionStart: number = start,
        selectionEnd: number = end,
        value: string = ``,
        stringCount: number = 0,
        cancelSpaceCount: number = 0,
        len: number = paragraph.length;

    for(let i = 0; i < len; i++){
        let item = paragraph[i]
        let nextStringCount = stringCount + item.length + 1

        if(nextStringCount > start && stringCount < end){
            let spaces = item.split(' '.repeat(tabSpaceCount))
            if(spaces.length !== 1 && spaces[0]  === ""){
                spaces.shift();
                cancelSpaceCount += tabSpaceCount
            }else{
                let oldlen =  spaces[0].length
                spaces[0] = spaces[0].trimLeft();
                let newlen = spaces[0].length
                cancelSpaceCount += (oldlen - newlen)
            }

            let newParagraph = spaces.join(' '.repeat(tabSpaceCount))
            paragraph[i] = newParagraph

            if(start > stringCount) selectionStart -= item.length - newParagraph.length;
            if(end < nextStringCount) selectionEnd -= cancelSpaceCount;
        }else if(stringCount > end){
            break;
        }

        stringCount = nextStringCount
    }

    value = paragraph.join('\n')

    setValue(value, selectionStart, selectionEnd)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 重写按下回车执行的操作
 * @param {HTMLTextAreaElement} el 
 * @param {Function} setValue 
 * @param {number} tabSpace 
 */
export const clickEnter = (el: HTMLTextAreaElement, setValue: Function, tabSpace: number): void => {
    const [start, end] = getCursorPosition(el);
    let flag = start === end, 
        value,
        selectionStart: number = start,
        selectionEnd: number = end;
    
    if(flag){
        let activeStr = el.value[start-1];
        const spaceStr = getActiveLineBeginSpaces(el, tabSpace)
        
        if(activeStr === '{'){
            if(el.value[start] === '}'){
                value = `${el.value.slice(0, start)}\n${' '.repeat(tabSpace) + spaceStr}\n${spaceStr}${el.value.slice(end)}`
                selectionStart = start + 1 + tabSpace + spaceStr.length
                selectionEnd = end + 1 + tabSpace + spaceStr.length
            }else{
                value = `${el.value.slice(0, start)}\n${' '.repeat(tabSpace) + spaceStr}\n${el.value.slice(end).trimLeft()[0] === '}' ? el.value.slice(end) : spaceStr + (el.value.slice(end))}`
                selectionStart = start + 1 + tabSpace + spaceStr.length
                selectionEnd = end + 1 + tabSpace + spaceStr.length
            }
        }else{
            value = `${el.value.slice(0, start)}\n${spaceStr}${el.value.slice(end)}`
            selectionStart = start + 1 + spaceStr.length 
            selectionEnd = end + 1 + spaceStr.length 
        }
    }else{
        value = `${el.value.slice(0, start)}\n${el.value.slice(end)}`
        selectionStart = start + 1
        selectionEnd = start + 1
    }
    setValue(value, selectionStart, selectionEnd)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 自动补全括号、引号 () [] {} '' ""
 * @param {HTMLTextAreaElement} el 
 * @param {Function} setValue 
 * @param {string[]} bracket 
 */
export const autoComplementBracket = (el: HTMLTextAreaElement, setValue: Function, bracket: string[])=>{
    const [start, end] = getCursorPosition(el)
    let flag = start === end,
        value: string = el.value,
        selectionStart: number = start,
        selectionEnd: number = end;
    if(flag){
        value = `${el.value.slice(0, start)}${bracket.join('')}${el.value.slice(end)}`
        selectionStart = start + bracket[0].length;
        selectionEnd = end + bracket[0].length;
    }else{
        value = `${el.value.slice(0, start)}${bracket[0]}${el.value.slice(start, end)}${bracket[1]}${el.value.slice(end)}`
        selectionStart = start + bracket[0].length;
        selectionEnd = end + bracket[0].length;
    }
    setValue(value, selectionStart, selectionEnd)
    setSelectionRange(el, selectionStart, selectionEnd)
}

/**
 * 获取光标所在行前面的tab字符
 * @param {HTMLTextAreaElement} el 
 * @param {number} tabSpace 
 * @returns {string}
 */
const getActiveLineBeginSpaces = (el: HTMLTextAreaElement, tabSpace: number): string => {
    const [start, end] = getCursorPosition(el)
    let flag = start === end,
        stringCount: number = 0,
        nextStringCount: number = 0,
        paragraph = el.value.split('\n'),
        spaces : number = 0;

    if(flag){
        let len = paragraph.length;

        for(let i = 0; i < len; i++){
            stringCount += (i === 0 ? 0 : (paragraph[i-1].length + 1));
            nextStringCount = stringCount + paragraph[i].length + 1;
            if(stringCount < start && nextStringCount > start){
                let items = paragraph[i].split(' '.repeat(tabSpace))
                for(let j = 0; j < items.length; j++){
                    if(items[j] === ""){
                        spaces++
                    }else{
                        break
                    }
                }
                if(items[items.length - 1] === ""){
                    spaces--
                }
                break
            }
        }
    }
    return spaces === 0 ? '' : ' '.repeat(spaces * tabSpace);
}