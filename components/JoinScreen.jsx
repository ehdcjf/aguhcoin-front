import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DuplicateCheckAction, UserJoinAction } from '../reducers/user';
import Router from 'next/router';
import styled from 'styled-components';
import useInput from '../hooks/useInput';

const JoinContainer = styled.div`
    display: block;
    position: fixed;
    width: 100%;
    padding: 5% 10%;
    background: #222;
`

const Title = styled.div`
    position: fixed;
    bottom: 15%;

    & > h1 {
        font-size: 50px;
    }
`

const StepBlock = styled.div`
    margin-bottom: 10px;
    text-align: right;
    
    & > div {
        display: inline-block;
        margin-left: 5px;
        padding: 2px 12px;
        background: slategray;
        border-radius: 1px;
        opacity: 90%;
        transition: 0.5s;
    }
`

const Content = styled.div`
    position: relative;
    width: 500px;
    height: 580px;
    float: right;
    background: #fff;

    & > h4 {
        padding: 10px 20px;
        font-weight: normal;
        color: #fff;
        background: #111;
    }

    & > form {
        padding: 30px;
    }

    & > form > div:nth-child(2) {
        margin-top: 50px;
    }
`

const InputContainer = styled.div`
    & > h5 {
        width: 100%;
        margin-bottom: 10px;
        font-size: 20px;
        color: #000;
        font-weight: normal;
    }

    & > input {
        width: 100%;
        padding: 10px 5px;
        margin-bottom: 10px;
        border: none;
        border-bottom: 1px solid;
        border-color: lightgray;
        outline: none;
    }
    & > input:hover {
        border-bottom: 1px solid #000;
        transition: 0.5s;
    }

    & > div {
        display: inline-block;
        width: 100%;
        padding: 10px;
    }

    & > div > label {
        width: 90%;
        float: left;
        color: #000;
        user-select: none;
    }

    & > div > input {
        width: 10%;
        height: 24px;
    }

    & > span {
        font-size: 15px;
    }
`

const ButtonBox = styled.div`
    position: absolute;
    width: 100%;
    padding: 30px;
    left: 0;
    bottom: 0;

    & > button {
        width: 30%;
        margin-left: 10px;
        padding: 10px 20px;
        float: right;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        border: none;
        border-radius: 3px;
    }
    & > button:nth-child(1) {
        background: crimson;
    }
    & > button:nth-child(2) {
        background: #666;
    }
    & > button:hover {
        color: #fff;
        transition: 0.5s;
        filter: brightness(120%);
    }
`

const JoinScreen = () => {
    const dispatch = useDispatch();
    const { userid, success } = useSelector((state) => state.user);

    const useridInput = useInput('');
    const userpw = useInput('');

    const [termCheck, setTermCheck] = useState(false);
    const [termCheck2, setTermCheck2] = useState(false);
    const [termCheckAll, setTermCheckAll] = useState(false);
    const [userpwCheck, setUserpwCheck] = useState(null);
    const [userpwError, setUserpwError] = useState(null);
    const [step, setStep] = useState(1);

    // ?????? Step?????? ??????
    const prevStep = e => {
        e.preventDefault();

        if (step == 1) {
            Router.push('/');
        }

        setTermCheck(false);
        setTermCheck2(false);
        setTermCheckAll(false);
        setStep(step-1);
    }

    // ?????? Step?????? ??????
    const nextStep = e => {
        e.preventDefault();

        if (termCheck == true && termCheck2 == true) {
            setStep(step+1);
        } else {
            alert('????????? ??????????????????.');
        }
    }

    // Step 1 ?????? ??????
    // ??????
    const handleTerm = e => {
        const selected = e.target.id.split('check',4)[1];

        if (selected == 1) {
            setTermCheck(!termCheck);
        } else {
            setTermCheck2(!termCheck2);
        }
    }

    // ?????? ??????
    const handleTermAll = () => {
        if (termCheck == false || termCheck2 == false || termCheckAll == false) {
            setTermCheck(true);
            setTermCheck2(true);
            setTermCheckAll(true);
        }
        if (termCheck == true && termCheck2 == true && termCheckAll == true) {
            setTermCheck(false);
            setTermCheck2(false);
            setTermCheckAll(false);
        }
    }

    // Step 2 ?????? ??????
    // ???????????? ????????? ??????
    const duplicateCheck = e => {
        if (useridInput.value != '') {
            const data = {
                userid: useridInput.value,
            }
    
            dispatch(DuplicateCheckAction(data));
        }
    }

    // ???????????? ????????? ?????? ?????????
    const pwdCheckMsg = e => {
        const { value } = { ...e.target };
        setUserpwError(userpw.value !== value);
        setUserpwCheck(value);
    }

    // ???????????? ????????? ????????? ??? ????????? ?????????
    const pwdFocusout = e => {
        if (userpwError === true){
            setUserpwCheck('');
            e.target.value = '';
        }
    }

    // ???????????? ?????? ?????? ??? submmit
    const handleSubmit = e => {
        e.preventDefault();

        const idInput = document.getElementById('idInput');
        const pwInput = document.getElementById('pwInput');
        const pwcInput = document.getElementById('pwcInput');

        if (useridInput.value == '' || pwInput.value == '' || pwcInput.value == ''){
            alert('???????????? ??????????????? ?????? ?????? ???????????????.');
            return;
        } else {
            setUserpwError(false);
        }

        const data = {
            userid:useridInput.value,
            userpw:userpw.value
        }

        dispatch(UserJoinAction(data));
        if (success == false) {
            alert('????????? ?????? ??????????????? ??????????????????.');
        } else {
            nextStep(e);
        }
    }

    // ????????????
    const goMain = e => {
        e.preventDefault();
        Router.push('/');
    }
    const goLogin = e => {
        e.preventDefault();
        Router.push('/login');
    }

    return (
        <>
            <JoinContainer>
                <Title>
                    <h1>???????????? ????????????</h1>
                </Title>
                <StepBlock>
                    <div id="step1" style={step == 1 ? {background:"crimson"} : {background:"slategray"}} />
                    <div id="step2" style={step == 2 ? {background:"crimson"} : {background:"slategray"}} />
                    <div id="step2" style={step == 3 ? {background:"crimson"} : {background:"slategray"}} />
                </StepBlock>
                <Content>
                    {
                        step == 1 &&
                        (
                            <>
                                <h4>?????? ??????</h4>
                                <form>
                                    <InputContainer>
                                        <div>
                                            <input
                                                id="check1"
                                                type="checkbox"
                                                checked={termCheck}
                                                onChange={handleTerm}
                                            />
                                            <label htmlFor="check1">???????????????.</label>
                                        </div>
                                        <div>
                                            <input
                                                id="check2"
                                                type="checkbox"
                                                checked={termCheck2}
                                                onChange={handleTerm}
                                            />
                                            <label htmlFor="check2">????????? ???????????????.</label>
                                        </div>
                                        <div style={{marginTop:"200px"}}>
                                            <input
                                                id="checkAll"
                                                type="checkbox"
                                                checked={termCheckAll}
                                                onChange={handleTermAll}
                                            />
                                            <label htmlFor="checkAll">?????? ????????????</label>
                                        </div>
                                    </InputContainer>
                                    <ButtonBox>
                                        <button onClick={nextStep}>????????????</button>
                                        <button onClick={prevStep}>????????????</button>
                                    </ButtonBox>
                                </form>
                            </>
                        )
                    }
                    {
                        step == 2 &&
                        (
                            <>
                                <h4>?????? ??????</h4>
                                <form onSubmit={handleSubmit}>
                                    <InputContainer>
                                        <h5>?????????</h5>
                                        <input
                                            id="idInput"
                                            type="text"
                                            onBlur={duplicateCheck}
                                            placeholder="????????? ??????"
                                            {...useridInput}
                                        />
                                        {
                                            success == false
                                            ? <span style={{ color: "red" }}>?????? ?????? ???????????? ??????????????????.</span>
                                            : null
                                        }
                                    </InputContainer>
                                    <InputContainer>
                                        <h5>????????????</h5>
                                        <input
                                            id="pwInput"
                                            type="password"
                                            placeholder="???????????? ??????"
                                            {...userpw}
                                        />
                                        <input
                                            id="pwcInput"
                                            type="password"
                                            value={userpwCheck}
                                            onChange={pwdCheckMsg}
                                            onBlur={pwdFocusout}
                                            placeholder="???????????? ?????????" />
                                        {
                                            userpwError == true
                                            ? <span style={{ color: "red" }}>??????????????? ???????????? ????????????.</span>
                                            : null
                                        }
                                    </InputContainer>
                                    <ButtonBox>
                                        <button type="submit">????????????</button>
                                        <button onClick={prevStep}>????????????</button>
                                    </ButtonBox>
                                </form>
                            </>
                        )
                    }
                    {
                        step == 3 &&
                        (
                            <>
                                <h4>?????? ??????</h4>
                                <form>
                                    <InputContainer>
                                        <span>
                                            {userid}?????? ????????? ??????????????? ?????? ???????????????.
                                        </span>
                                    </InputContainer>
                                    <ButtonBox>
                                        <button onClick={goLogin}>?????????</button>
                                        <button onClick={goMain}>????????????</button>
                                    </ButtonBox>
                                </form>
                            </>
                        )
                    }
                </Content>
            </JoinContainer>
        </>
    );
}

export default JoinScreen;
