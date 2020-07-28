import React from 'react';
import axios from 'axios';
import { Button , message } from "antd";
import './App.css';
import SearchBar from "./Components/SearchBar.js";
import "antd/dist/antd.css";
import { Transition, animated } from 'react-spring/renderprops'



class App extends React.Component {
  constructor(){
    super();
    this.state={
      recipes: [],
      vegan: false,
      vegetarian: false,
      gluten_free: false,
      allergy: "",
      current_page: 0,
      search_text: "",
      key: "8f05b2f0c3e1df482f377b7c8a81f351",
      ID: "1d13ceac",
      showFirst: true,
      showSecond: false,
      index: 0
    }
  }

  changeParent= (field,value) => {
    this.setState({
      [field]:value
    });
  };

  toggle = e =>
    this.setState(state => ({
      index: state.index === 1 ? 0 : state.index + 1,
    }))

  next=() => {
    if (this.state.recipes.length > 0) {
      let page = this.state.current_page + 10
      let endPage = this.state.current_page + 21
      axios 
            .get(this.state.search_text + "&from=" + page + "&to=" + endPage)
            .then(response=> {
                this.setState({
                    recipes: response.data.hits,
                    current_page: page
                });
                if(this.state.recipes.length<1){
                  message.warning("No results found");
              }
          })
          .catch(error=>{
              console.log(error)
          })
    }
  }

  prev=() => {
    if (this.state.current_page > 9) {
      let page = this.state.current_page - 10
      let endPage = this.state.current_page + 1
      axios 
            .get(this.state.search_text + "&from=" + page + "&to=" + endPage)
            .then(response=> {
                this.setState({
                    recipes: response.data.hits,
                    current_page: page
                });
                if(this.state.recipes.length<1){
                  message.warning("No results found");
              }
          })
          .catch(error=>{
              console.log(error)
          })
      }
    }



  render(){
    let pics = this.state.recipes.map(pic=>{
        let img = pic.recipe.image;
        let link = pic.recipe.url;
        let name = pic.recipe.label;
        let ingredients = [];
        let health = [];
        let diet = [];
        let fatSat = Math.round(pic.recipe.totalNutrients.FASAT.quantity);
        let cal = Math.round(pic.recipe.totalNutrients.ENERC_KCAL.quantity);
        let fat = Math.round(pic.recipe.totalNutrients.FAT.quantity);
        let protein = Math.round(pic.recipe.totalNutrients.PROCNT.quantity)
        
        const pages = [
          style => (
            <animated.div style={{ ...style}}>
              <div className="contentBox">
                      
                <img src={img} className="Images"></img>
          
                <tr className = "table">
                  <thead>
                   Ingredients
                  </thead>
                  <tbody>{ingredients}</tbody>
                </tr>
              </div></animated.div>),

          style => (
            <animated.div style={{ ...style}}><div className="contentBox">
            <img src={img} className="Images"></img>
            <tr className="table2">
            <thead>
              Nutrition Facts
            </thead>
            <tbody>
              <h3>Calories: {cal}</h3>
            <h3>Fat: {fat}g</h3>
            <h3>Saturated Fat: {fatSat}g</h3>
            <h3>Protein: {protein}g</h3>
            </tbody>
            </tr>
              <tr className = "table2">
                <thead>
                  Diet Labels
                </thead>
                <tbody><h3>{diet}</h3></tbody>
                <thead>
                  Health Labels
                </thead>
                <tbody><h3>{health}</h3></tbody>
              </tr>
            </div>
            </animated.div>)
        ]

        for (const [index, value] of  pic.recipe.ingredientLines.entries()) {
          ingredients.push(<li key={index}>{value}</li>)
        }
        for (const [index, value] of  pic.recipe.dietLabels.entries()) {
          diet.push(<li key={index}>{value}</li>)
        }
        for (const [index, value] of  pic.recipe.healthLabels.entries()) {
          health.push(<li key={index}>{value}</li>)
        }

        return(
          <div className="wholeRecipe">
            <div>
              <h1>{name}</h1>
            </div>
            <div className="main" onClick={this.toggle}>
              <Transition
                native
                reset
                unique
                items={this.state.index}
                from={{ opacity: 0, transform: 'translate3d(100%,0,0)' }}
                enter={{ opacity: 1, transform: 'translate3d(0%,0,0)' }}
                leave={{ opacity: 0, transform: 'translate3d(-100%,0,0)' }}
                config={{ duration: 500}}>
                {index => pages[index]}
              </Transition>
            </div>
            <div>
              <a href={link} target="_blank">
              <Button type="primary" className="button">Full Recipe</Button>
              </a>
            </div>
          </div>
        )
    })

    return(
      <div className="App">
        <header>
        <SearchBar
          changeParent={this.changeParent}>
          </SearchBar>
          
        <img src="http://clipart-library.com/img/1695183.png" className="logo"></img>
        <h1 className="Title">The Cookbook</h1>
        </header>
        <div>
          <hr></hr>
          {pics}   
        </div>
        <footer>
          <Button type="primary" className="np" onClick={() => this.prev(this.state.current_page)}>
            Previous
          </Button>
          <Button type="primary" className="np"onClick={()=> this.next(this.state.current_page)}>
            Next
          </Button>
        </footer>
      </div>
    )
  }
}

export default App;
