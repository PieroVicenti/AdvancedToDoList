import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'


const getLocalStorage = ()=>{
  let list = localStorage.getItem('list');
  if (list){
    return JSON.parse(localStorage.getItem('list'))
  }
  else{
    return []
  }
}

function App() {
     
    const [name, setName] = useState('')
    const [list, setList] = useState(getLocalStorage())
    const [isEditing, setIsEditing] = useState(false)
    const [editID, setEditID] = useState(null)
    const [alert, setAlert] = useState({show: false, msg:'', type: ''})

  //dato che ho messo onSubmit sul form, non avrò busogno della onClick function sul bottone(che comunque è un'alternativa)
    const handleSumbit = (e) =>{
      e.preventDefault();
      //check if there is a value to submit or not, if not...display alert
      if(!name){
        setAlert({show: true, msg:'Please enter value', type:'danger'})
      }
      else if(name && isEditing){
        //deal with edit
        setList(
          list.map((item)=>{
            if(item.id === editID){
            return {...item, title: name}
          }
            return item
        })
      )
    
    setName('');
    setEditID(null);
    setIsEditing(false);
    setAlert(true, 'Item changed', 'success');
   }
      else{
        //show alert
        const newItem = {id: new Date().getTime().toString(), title: name};
        setList([...list, newItem]);
        setAlert({show:true, msg:'Item entered', type:'success'})
        setName('')
      }
    }


  const clearAll = ()=>{
      setAlert({show: true, msg: 'Empty list', type: 'danger'})
      setList([]);
    }

  const removeItem = (id)=>{
     setAlert({show: true, msg:'Item removed', type:'danger'})
     setList(list.filter((item)=>item.id !== id))
  }

  const editItem = (id)=>{
    const specificItem = list.find((item)=> item.id === id);
    setIsEditing(true);
    setEditID(id)
    setName(specificItem.title)
  }
  useEffect(()=>{
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])
  return( 
  <section className='section-center'>
    <form className='grocery-form' onSubmit={handleSumbit}>
      {alert && <Alert {...alert} removeAlert={setAlert}
    removeAlert={setAlert} list={list}/>} 
      <h3>Grocery Bud</h3>
      <div className='form-control'>
        <input type='text' className='grocery' placeholder='e.g. eggs' value={name} onChange={(e)=>setName(e.target.value)} ></input>
        <button type='submit' className='submit-btn'>
          {isEditing? 'edit': 'submit'}
        </button>
      </div>
    </form>
    {list.length > 0 && ( //qui stiamo dicendo che, solo se sta qualcosa nella lista ci deve mostrare la lista
    <div className='grocery-container'>
    <List items={list} removeItem={removeItem} editItem={editItem}/>
    <button className='clear-btn' onClick={clearAll}>
      Clear items
    </button>
    </div>
    )}
    </section>
  )
}

export default App
