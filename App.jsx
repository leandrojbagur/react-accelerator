import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class App extends React.Component {
   constructor() {
       super();

       this.state = {
           selectedState: '',
           selectedCity: '',
           states: [],
           cities: [],
           neighborhoods: []
       };

       axios.get("http://localhost:5000/BR/states")
            .then(response => {
                this.setState({ states : response.data});
            });

       this.getChildren = this.getChildren.bind(this);
   }

    getChildren(childrenType, id, name) {
       axios.get("http://localhost:5000/" + id + "/" + childrenType)
           .then(response => {
               let data = {};
               data[childrenType] = response.data;

               if (childrenType === 'cities') {
                   data['neighborhoods'] = [];
                   data['selectedState'] = name;
                   data['selectedCity'] = '';
               } else{
                   data['selectedCity'] = name;
               }
               this.setState(data);
           });
   }

   render() {
       const divStyle = {
           display: 'inline-block',
           width: 300
       };

       const divCont = {
         display: 'flex'
       };

       const lbl = {
         display: 'block'
       };

      return (
         <div>
             <div>
                 <label style={lbl}>State: {this.state.selectedState}</label>
                 <label style={lbl}>City: {this.state.selectedCity}</label>
             </div>
             <div style={divCont}>
                 <div id={"states"} style={divStyle}>
                 {this.state.states.map((state, i) => <List key = {i}
                                                                data = {state}
                                                                getChildren = {this.getChildren}
                                                                childrenType = 'cities'
                                                                hasLink = { true } />)}
                 </div>
                 <div id={"cities"} style={divStyle}>
                     {this.state.cities.map((city, i) => <List key = {i}
                                                                   data = {city}
                                                                   getChildren = {this.getChildren}
                                                                   childrenType = 'neighborhoods'
                                                                   hasLink = { true } />)}
                 </div>
                 <div id={"neighborhoods"} style={divStyle}>
                     {this.state.neighborhoods.map((neighborhood, i) => <List key = {i}
                                                                                  data = {neighborhood}
                                                                                  hasLink = { false } />)}
                 </div>
             </div>
         </div>
      );
   }
}

class List extends React.Component {
    render () {
        const link = {
            cursor: 'pointer'
        };

        if (this.props.hasLink === true) {
            return (
                <ul>
                    <li onClick={() => this.props.getChildren(this.props.childrenType, this.props.data.id, this.props.data.name)}
                        style={link}>{this.props.data.name}</li>
                </ul>
            );
        } else {
            return (
                <ul>
                    <li>{this.props.data.name}</li>
                </ul>
            );
        }
    }
}

List.propTypes = {
    childrenType: PropTypes.string,
    hasLink: PropTypes.bool.isRequired
};

export default App;

