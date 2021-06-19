import React, { FC, ReactElement, useCallback, useState, useEffect, useMemo } from 'react'
import { NavBarContainer } from './style'
import {
    BoldOutlined, ItalicOutlined, StrikethroughOutlined, FontSizeOutlined,
    UnorderedListOutlined, OrderedListOutlined, LinkOutlined, PictureOutlined,
    TableOutlined 
} from '@ant-design/icons'
import { message, Tooltip, Menu, Dropdown } from 'antd'
import {
    handleText, addTitle, addList, addLink, addPhoto, addTable
} from './utils'
import { IProps } from './type'

const { Item, ItemGroup } = Menu

// const codeThemeList = ['default','hybrid', 'dark', 'github', 'atelier-lakeside-dark', 'color-brewer', 'docco', 'mono-blue', 'paraiso-dark']
// const markdownThemeList = ['maize', 'guthub']

const NavBar: FC<IProps> = ({
    value,
    setValue,
    editorElement
}): ReactElement => {
    
    const [codeTheme, setCodeTheme] = useState<string>('hybrid')
    const [markdownTheme, setMarkdownTheme] = useState<string>('guthub')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        let head = document.head
        let oldLink = head.getElementsByClassName('markdownTheme-style-link')

        if(oldLink.length) head.removeChild(oldLink[0])

        let newLink = document.createElement('link')
        newLink.setAttribute('rel', 'stylesheet')
        newLink.setAttribute('type', 'text/css')
        newLink.setAttribute('class', 'markdownTheme-style-link')
        newLink.setAttribute('href', `https://cdn.bootcdn.net/ajax/libs/primer-markdown/4.1.0-alpha.e45cefe1/build.min.css`)
        newLink.onload = () => setLoading(false);
        newLink.onerror = () => {
            setLoading(false);
            message.error('主题获取失败，请稍后重试或尝试其它主题')
        }
        head.appendChild(newLink)
    }, [markdownTheme])

    useEffect(()=>{
        let head = document.head;
        let oldLink = head.getElementsByClassName('highlightjs-style-link')
        if(oldLink.length) head.removeChild(oldLink[0])

        let newLink = document.createElement('link')
        newLink.setAttribute('rel', 'stylesheet')
        newLink.setAttribute('type', 'text/css')
        newLink.setAttribute('class', 'highlightjs-style-link')
        newLink.setAttribute('href', `https://cdn.bootcss.com/highlight.js/9.6.0/styles/${codeTheme}.min.css`)
        newLink.onload = () => setLoading(false);
        newLink.onerror = () => {
            setLoading(false);
            message.error('主题获取失败，请稍后重试或尝试其它主题')
        }
        head.appendChild(newLink)
    }, [codeTheme])

    const TitleMenu = (
        <Menu onClick={(a: any)=>addTitle(editorElement, a.key, a.domEvent.target.innerText, setValue)}>
            <Item key="#">一级标题</Item>
            <Item key="##">二级标题</Item>
            <Item key="###">三级标题</Item>
            <Item key="####">四级标题</Item>
            <Item key="#####">五级标题</Item>
            <Item key="######">六级标题</Item>
        </Menu>
    )



    return (
        <NavBarContainer>
            <Tooltip title="加粗">
                <BoldOutlined className="item" onClick={()=>handleText(editorElement, '**', '加粗文本', setValue)} />
            </Tooltip>
            <Tooltip title="斜体">
                <ItalicOutlined className="item" onClick={()=>handleText(editorElement, '*', '斜体文本', setValue)} />
            </Tooltip>
            <Tooltip title="中划线">
                <StrikethroughOutlined className="item" onClick={()=>handleText(editorElement, '~~', '中划线', setValue)}  />
            </Tooltip>
            <Dropdown
                overlay={TitleMenu}
                placement="bottomCenter" 
                arrow
            >
                <FontSizeOutlined className="item" />
            </Dropdown>
            <Tooltip title="无序列表">
                <UnorderedListOutlined className="item" onClick={()=>addList(editorElement, '-', setValue)} />
            </Tooltip>
            <Tooltip title="有序列表">
                <OrderedListOutlined className="item" onClick={()=>addList(editorElement, '1.', setValue)} />
            </Tooltip>
            <Tooltip title="超链接">
                <LinkOutlined className="item" onClick={()=>addLink(editorElement, setValue)} />
            </Tooltip>
            <Tooltip title="图片">
                <PictureOutlined className="item" onClick={()=>addPhoto(editorElement, setValue)} />
            </Tooltip>
            <Tooltip title="表格">
                <TableOutlined className="item" onClick={()=>addTable(editorElement, setValue)} />
            </Tooltip>
        </NavBarContainer>
    )
}

export default NavBar