import React from 'react'
import './App.css'
import logo from './stonks.jpeg';

// ...later


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      lastPage: 1,
      data: [],
      isLoaded: false,
      searchTerm: ''
    }
  }

  fetchData(page, searchTerm = ''){
    fetch(`http://localhost:8080/?page=${page}&search=${searchTerm && searchTerm.length > 0? searchTerm : ''}`)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          data: result.data,
          lastPage: result.lastPage,
          page: result.currentPage,
          isLoaded: true
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }
  componentDidMount() {
   this.fetchData(this.state.page)
  }

  renderTable(){
    let row = [(
      <tr className="row">
          <td className={'column header'}>ID</td>
          <td className={'column header'}>Title</td>
          <td className={'column header'}>Category</td>
          <td className={'column header'}>Preview Image</td>
        </tr>
    )]
    let processedRow =  this.state.data.map(( listValue, index ) => {
      return (
        <tr key={index} className="row">
          <td className='column'>{listValue.id}</td>
          <td className='column'>{listValue.title}</td>
          <td className='column'>{listValue.category}</td>
          <td className='column'><img src={logo} alt="logo" className='img'/></td>
        </tr>
      );
    })
    return row.concat(processedRow)
  }

  previousPage(){
    if(this.state.page > 1){
      this.fetchData(this.state.page - 1, this.state.searchTerm)
    } 
  }

  nextPage(){
    if(this.state.page < this.state.lastPage){
      this.fetchData(this.state.page + 1, this.state.searchTerm)
    } 
  }

  search(e){
    this.fetchData(1, e.target.value)
    this.setState({searchTerm: e.target.value});
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <h2>Video Tutorial</h2>
        </header>
        <div className='table-header'>
          <label for="search" className='label'>Search:</label>
          <input id='search' type='text' className='input' pattern="[a-zA-Z'-'\s]*" onChange={(e)=> this.search(e)} value={this.state.searchTerm}></input>
        </div>
        <table className='table'>            
          {this.state.isLoaded ?  this.renderTable() : null}
        </table>
        <div className='table-bottom'>
          <button className='button' onClick={() => this.previousPage()}>{'<'}</button>
          <p>Page : {this.state.page} of {this.state.lastPage}</p>
          <button className='button' onClick={() => this.nextPage()}>{'>'} </button>
        </div>
      </div>
    );
  }

}

export default App;
