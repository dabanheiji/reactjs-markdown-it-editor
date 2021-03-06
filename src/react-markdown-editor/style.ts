import styled from 'styled-components'

export const MarkdownEditContainer = styled.div`
    box-sizing: border-box;
    height: 100%;
    div, p{
        box-sizing: border-box;
    }
    .spining{
        height: calc( 100% - 50px );
    }
    .markdown-main{
        height: 100%;
        display: flex;
        padding: 0;
        .line-container{
            width: 48px;
            height: 100%;
            overflow: hidden;
            background: #272727;
            padding-top: 0px;
            box-sizing: border-box;
            display: none;
            .line-num{
                width: 100%;
                text-align: center;
                line-height: 26px;
                color: #fff;
                margin: 0;
            }
        }
        .markdown-editor{
            width: calc( 50% );
            height: 100%;
            border: none;
            outline: none;
            background: #2d2d2d;
            box-sizing: border-box;
            resize: none;
            font-size: 16px;
            padding: 0 20px 0;
            line-height: 26px;
            color: #69c0ff;
            transition: width .5s;
            &.hide{
                width: 0;
                padding: 0;
            }
        }
        .markdown-preview{
            width: 50%;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: scroll;
            transition: width .5s;
            &.prev{
                width: 100%;
            }
        }
    }
`

export const NavBarContainer = styled.nav`
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .item{
        cursor: pointer;
        margin-right: 8px;
        padding: 5px;
        font-size: 17px;
        border-radius: 3px;

        &:hover {
            background-color: #eee;
        }

        &.code {
            padding: 5px 0;
        }
    }
    .active{
        background: rgba(0, 255, 255, .5);
        border: 1px solid rgb(0, 255, 255);
    }
    .right {
        flex: 1;
        text-align: right;
    }
`