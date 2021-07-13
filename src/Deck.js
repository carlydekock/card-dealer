import React, { Component } from 'react';
import Card from './Card.js';
import axios from 'axios';

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

class Deck extends Component {
  constructor(props){
    super(props);
    this.state = {deck: null, drawnCards: []}
    this.getCard = this.getCard.bind(this);
  }

  async componentDidMount(){
    let deck = await axios.get(`${API_BASE_URL}/new/shuffle`);
    this.setState({deck: deck.data});
  }

  async getCard(){
    let id = this.state.deck.deck_id;
    try {
      let cardUrl = `${API_BASE_URL}/${id}/draw/`;
      let cardRes = await axios.get(cardUrl);
      if(!cardRes.data.success){
        throw new Error("No cards remaining!");
      }
      let card = cardRes.data.cards[0];
      this.setState(st => ({
        drawnCards: [
          ...st.drawnCards,
          {
            id: card.code,
            image: card.image,
            name: `${card.value} of ${card.suit}`
          }
        ]
      }))
    } catch (err){
      alert(err);
    }
  }

  render(){
    const cards = this.state.drawnCards.map(card => (
      <Card key={card.id} name={card.name} image={card.image} />
    ));

    return (
      <div className="Deck">
        <h1>Card Dealer</h1>
        <button onClick={this.getCard}>Get Card!</button>
        {cards}
      </div>
    )
  }
}

export default Deck;