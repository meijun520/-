import style from './index.less';
import socketio from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
class LeftMeaaage extends React.Component {
  render() {
    return (
      <div>
        <div className={this.props.time ? style.timebac : ''}>
          {this.props.time}
        </div>
        <div className={style.cler1}>
          <div className={style.icon}>{this.props.name}</div>
          <div className={style.mess}>
            <div className={style.bacright}></div>
            <div>{this.props.message}</div>
          </div>
        </div>
      </div>
    );
  }
}
class RightMeaaage extends React.Component {
  render() {
    return (
      <div>
        <div className={this.props.time ? style.timebac : ''}>
          {this.props.time}
        </div>
        <div className={style.cler2}>
          <div className={style.mess}>
            <div>{this.props.message}</div>
            <div className={style.bacleft}></div>
          </div>
          <div className={style.icon}>{this.props.name}</div>
        </div>
      </div>
    );
  }
}
export default function WeChat() {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState('');
  const [io, setio] = useState();
  const [user, setUser] = useState('');
  const [count, setCount] = useState(0);
  useEffect(() => {
    setUser(history.location.query.user);
    let io = socketio('http://localhost:3000', {
      //transports和服务端统一，否则会跨域
      transports: ['websocket'],
    });
    console.log(io.id);
    let messageList = [];
    io.on('pushMsg', function (msg, time) {
      messageList.push({ ...msg, time: time });
      let nowlist = [];
      for (let i = 0; i < messageList.length; i++) {
        let a = new Date(messageList[i].time);
        let s = a.getHours();
        let f = a.getMinutes();
        if (i > 1) {
          console.log(messageList[i], 6666);
          let usedTime =
            new Date(messageList[i].time).getTime() -
            new Date(messageList[i - 1].time).getTime();
          console.log(usedTime, 6666);
          if (usedTime > 60000) {
            nowlist.push({ ...messageList[i], time: `${s}:${f}` });
            console.log(list, 8888);
          } else {
            nowlist.push({ ...messageList[i], time: '' });
          }
          setList([...nowlist]);
          console.log(list, 8888);
        } else {
          nowlist.push({ ...messageList[i], time: `${s}:${f}` });
          setList([...nowlist]);
          console.log(list, 8888);
        }
      }
    });
    io.on('countmsg', function (msg) {
      setCount(msg);
    });
    setio(io);
  }, []);
  useEffect(() => {
    if (user) {
      io.emit('user', user);
      console.log(user, 8989);
      io.on('islogin', (msg) => {
        if (msg.islogin === false && msg.user === user) {
          io.close();
          alert('该用户已存在');
          history.push('/');
        }
      });
    }
  }, [user]);

  function sendmessage() {
    if (message) {
      io.emit('sendMsg', { name: user, message: message });
      setMessage('');
    }
  }

  return (
    <div className={style.chat}>
      <div>
        在线人数{count}
        {history.location.query.user}
      </div>
      <div className={style.right}>
        <div className={style.messages} id="mes">
          {list.map((item, index) =>
            user == item.name ? (
              <RightMeaaage
                name={item.name}
                message={item.message}
                time={item.time}
              />
            ) : (
              <LeftMeaaage
                name={item.name}
                message={item.message}
                time={item.time}
              />
            ),
          )}
        </div>
        <div className={style.form}>
          <input
            type="text"
            className={style.m}
            id="input"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button onClick={sendmessage}>send</button>
        </div>
      </div>
    </div>
  );
}
