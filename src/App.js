import { useEffect, useState } from 'react';
import socketIO from 'socket.io-client';
import styled, { css } from 'styled-components';

import './assets/fonts.css';

// Styled Components
const Header = styled.header`
	background-color: #2c3e50;
	padding: 20px;
	width: 100%;
	display: flex;
	justify-content: center;
`;

const Container = styled.main`
	width: 1000px;
	height: 450px;
	margin: 50px auto;
	display: flex;
	flex-direction: column;
	background-color: #34495e;
	border-radius: 10px;

	@media screen and (max-width: 1024px) {
		width: 95%;
		margin: 10px auto;
	}
`;

const MessageContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	overflow-y: auto;
	border-radius: 10px 10px 0px 0px;
	flex-direction: column;
	justify-content: flex-end;
	background: #2c3e50;
`;

const ToolBar = styled.div`
	width: 100%;
	display: flex;
	padding: 10px;
`;

const InputMessage = styled.div`
	width: 100%;
	padding: 10px;
	border-radius: 5px 0px 0px 5px;
	outline: 0 !important;
	color: #fff;
	background-color: #95a5a6;
`;

const ButtonSend = styled.button`
	padding: 10px 25px;
	background-color: #2ecc71;
	color: #fff;
	font-family: 'Barlow';
	font-weight: 500;
	border-style: none;
	outline: 0 !important;
	cursor: pointer;
	border-radius: 0px 5px 5px 0px;
`;

const ContainerMessageSend = styled.div`
	width: 100%;
	display: block;
`;

const MessageSend = styled.div`
	display: inline-block;
	margin: 20px;
	padding: 10px;
	color: #fff;
	max-width: 500px;
	word-wrap: break-word;
	font-family: 'Nunito';
	background-color: #3498db;
	border-radius: 10px;

	${(props) =>
		props.received &&
		css`
			background-color: #2ecc71;
			color: #fff;
		`}
`;

const socket = socketIO('https://chat-api-react.herokuapp.com/');
function App() {
	socket.on('sendNewMessage', (data) => {
		setAllMessages([...allMessages, { msg: data, received: true }]);
	});
	const [message, setMessage] = useState('');
	const [allMessages, setAllMessages] = useState([]);
	const sendMSG = () => {
		socket.emit('sendMessage', message);
	};

	const handleSend = () => {
		if (message !== '') {
			setAllMessages([...allMessages, { msg: message }]);
			document.querySelector('.input-message').innerText = '';
			setMessage('');
			sendMSG();
		}
	};

	const handleKeyUp = async (e) => {
		await setMessage(e.target.innerText);
		if (e.keyCode === 13 && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	useEffect(() => {
		// eslint-disable-next-line
	}, []);

	return (
		<div className="App">
			<Header>
				<h1
					style={{
						color: 'white',
						fontFamily: 'Barlow',
						fontWeight: '700',
					}}
					className="header__title"
				>
					Chat con React
				</h1>
			</Header>
			<Container className="container-all">
				<MessageContainer className="message-container">
					{allMessages.map((msg, index) => {
						if (msg.received) {
							return (
								<ContainerMessageSend key={index}>
									<MessageSend received>{msg.msg}</MessageSend>
								</ContainerMessageSend>
							);
						}
						return (
							<ContainerMessageSend key={index}>
								<MessageSend>{msg.msg}</MessageSend>
							</ContainerMessageSend>
						);
					})}
				</MessageContainer>
				<ToolBar>
					<InputMessage
						style={{
							fontFamily: 'Barlow',
							fontWeight: '700',
						}}
						className="input-message"
						onKeyUp={handleKeyUp}
						contentEditable
					></InputMessage>
					<ButtonSend onClick={handleSend}>Enviar</ButtonSend>
				</ToolBar>
			</Container>
		</div>
	);
}

export default App;
