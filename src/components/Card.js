export default class Card {
  constructor(
    { name, link, isLiked, _id, userId, ownerId },
    myId,
    cardSelector,
    handleCardClick,
    handleDeleteClick,
    handleLikeClick
  ) {
    this._name = name;
    this._link = link;
    this._likes = isLiked;
    this._id = _id;
    this._userId = userId;
    this._ownerId = ownerId;
    this._myId = myId;
    this._cardSelector = cardSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
  }

  getId() {
    return this._id;
  }

  _getData() {
    return {
      name: this._name,
      link: this._link,
    };
  }

  setLikes(isLiked) {
    this._likes = isLiked;
    this._renderLikes();
  }

  _renderLikes() {
    if (this._likes) {
      this._cardElement
        .querySelector(".card__like-button")
        .classList.add("card__like-button_active");
    } else {
      this._cardElement
        .querySelector(".card__like-button")
        .classList.remove("card__like-button_active");
    }
  }

  _hideDeleteButton() {
    if (this._ownerId !== this._myId) {
      this._cardElement.querySelector(".card__delete-button").remove();
    }
  }

  _setEventListeners() {
    const likeButton = this._cardElement.querySelector(".card__like-button");
    likeButton.addEventListener("click", () => this._handleLikeClick(this));

    const deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    deleteButton.addEventListener("click", () => {
      this._handleDeleteClick(this);
    });

    const cardImage = this._cardElement.querySelector(".card__image");
    cardImage.addEventListener("click", () => {
      this._handleCardClick(this._getData());
    });
    this._hideDeleteButton();
  }

  remove() {
    this._cardElement.remove();
  }

  _getTemplate() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return this._cardElement;
  }

  _fillCardTemplate() {
    const cardImage = this._cardElement.querySelector(".card__image");
    cardImage.alt = `Photo of ${this._name}`;
    cardImage.src = this._link;
    this._cardElement.id = this._id;
    this._cardElement.querySelector(".card__title").textContent = this._name;
  }

  getView() {
    this._cardElement = this._getTemplate();
    this._fillCardTemplate();
    this._setEventListeners();
    this._renderLikes();
    return this._cardElement;
  }
}
