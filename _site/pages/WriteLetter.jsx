import React, { useState } from 'react';
import '../styles/WriteLetter.css';

const WriteLetter = () => {
  const [letter, setLetter] = useState({
    title: '',
    content: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里添加发送信件的逻辑
    console.log('信件已提交:', letter);
  };

  return (
    <div className="write-letter-container">
      <h1>WRITE</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">标题：</label>
          <input
            type="text"
            id="title"
            value={letter.title}
            onChange={(e) => setLetter({...letter, title: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">内容：</label>
          <textarea
            id="content"
            value={letter.content}
            onChange={(e) => setLetter({...letter, content: e.target.value})}
            rows="10"
          />
        </div>
        <button type="submit">发送</button>
      </form>
    </div>
  );
};

export default WriteLetter; 