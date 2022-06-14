import styles from './index.less';
import { history } from 'umi';
import   '@/global.less'
import { useState } from 'react';
export default function IndexPage() {
  let [user,setUser]=useState('')
  function handleClick(){
   
    history.push({pathname:'./chat',query:{user:user}})
  }
  function handleChange(e){
    setUser(e.target.value)
  }
  return (
    <div>
      输入用户名
      <input className={styles.title} value={user} onChange={handleChange}/> <button onClick={handleClick}>提交</button>
    </div>
  )


}
