import style from './index.less';
import socketio from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
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
    io.on('pushMsg', function (msg) {
      list.push(msg);
      setList([...list]);
      console.log(list, 8888);
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
        <ul className={style.messages} id="mes">
          {list.map((item, index) => (
            <li
              key={index}
              className={
                user == item.name ? style.chartlistright : style.chartlistleft
              }
            >
              {user == item.name
                ? item.message + item.name + ':'
                : item.name + ':' + item.message}
            </li>
          ))}
        </ul>
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
