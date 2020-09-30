import React, { Component } from 'react';
import '../css/App.css';
import AddAppointments from './AddAppointment';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';
import {without, findIndex} from 'lodash';

class App extends Component {

  constructor(){
    super();
    this.state = {
      myAppointments : [],
      lastIndex: 0, 
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
      formDisplay: false
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  //search appointments

  searchApts = function(query){
    this.setState({
      queryText: query
    });
  }

  addAppointment= function(apt){
    let temptApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    temptApts.unshift(apt);
    this.setState({
      myAppointments: temptApts,
      lastIndex: this.state.lastIndex + 1
    })
  }

  //change order
  changeOrder = function(order, direction){
    this.setState({
      orderBy: order,
      orderDir: direction
    })
  }

  //delete appointments 

  deleteAppointment =  function (apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);
    this.setState({
      myAppointments : tempApts
    });
  }

  //toggle Form
  toggleForm = function(){
    this.setState({
      formDisplay : !this.state.formDisplay
    });
  }

  //update Info
  updateInfo = function (name, value, id) {
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId : id
    })
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppointments: tempApts
    })
  }

  componentDidMount(){
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
          const apts = result.map(item =>{
            item.aptId = this.state.lastIndex;
            this.setState({
              lastIndex: this.state.lastIndex+1
            });
            return item;
          })

          this.setState({
            myAppointments: apts
          });
      })
  }

  render(){

    let order;
    let filterApts = this.state.myAppointments;
    if(this.state.orderDir === 'asc'){
      order = 1;
    } 
    else{
      order = -1;
    }

    filterApts = filterApts
      .sort((a, b) => {
        if (
          a[this.state.orderBy].toLowerCase() <
          b[this.state.orderBy].toLowerCase()
        ) {
          return -1 * order;
        } else {
          return 1 * order;
        }
      })
      .filter(eachItem => {
        return (
          eachItem['petName']
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem['ownerName']
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem['aptNotes']
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase())
        );
      });

    return (
      <main className="page bg-white" id="petratings">
      <div className="container">
        <div className="row">
          <div className="col-md-12 bg-white">
            <div className="container">
              <AddAppointments formDisplay = {this.state.formDisplay}
                toggleForm={this.toggleForm}
                addAppointment={this.addAppointment}/>
              <SearchAppointments orderBy ={this.state.orderBy}
               orderDir={this.state.orderDir} 
               changeOrder={this.changeOrder}
               searchApts={this.searchApts}/>
              <ListAppointments appointments={filterApts}
               deleteAppointment={this.deleteAppointment}
               updateInfo={this.updateInfo}/>
            </div>
          </div>
        </div>
      </div>
    </main>
    );
  }
  
}

export default App;
