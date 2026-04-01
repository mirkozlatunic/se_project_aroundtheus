import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import "../pages/index.css";
import {
  // initialCards,
  profileEditButton,
  profileAddButton,
  profileEditModal,
  addCardModal,
  previewImageModal,
  profileModalCloseButton,
  addCardModalCloseButton,
  previewModalCloseButton,
  profileTitle,
  profileDescription,
  modalTitleInput,
  modalDescriptionInput,
  profileEditForm,
  addCardForm,
  cardListEl,
  cardTemplate,
  cardTitleInput,
  cardUrlInput,
  previewImage,
  previewFooter,
  formValidationConfig,
} from "../utils/constants.js";
import Api from "../components/Api.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";

// =============================================================================
// API + userInfo
// =============================================================================

let userID;
let cardList;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "a9aaf24d-57aa-44df-b0d5-364cf1f03985",
    "Content-Type": "application/json",
  },
});

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  professionSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([user, initialCards]) => {
    userInfo.setUserInfo(user);
    userID = user._id;

    cardList = new Section(
      {
        items: initialCards,
        renderer: ({ name, link, isLiked, _id, userId, ownerId }) => {
          const newCard = createCard({
            name,
            link,
            isLiked,
            _id,
            userId,
            ownerId,
          });
          cardList.addItem(newCard);
        },
      },
      ".cards__list"
    );
    cardList.renderItems();
  })
  .catch(console.error);

// =============================================================================
// Handle Clicks
// =============================================================================

function handleLikeClick(cardInstance) {
  if (cardInstance._likes) {
    api
      .unlikeCard(cardInstance._id)
      .then((res) => {
        cardInstance.setLikes(res.isLiked);
      })
      .catch(console.error);
  } else {
    api
      .likeCard(cardInstance._id)
      .then((res) => {
        cardInstance.setLikes(res.isLiked);
      })
      .catch(console.error);
  }
}

function handleCardClick(data) {
  previewImagePopup.open(data);
}

const deleteCardPopup = new PopupWithConfirmation("#delete-card-modal");
deleteCardPopup.setEventListeners();

function handleDeleteClick(card) {
  deleteCardPopup.open();
  deleteCardPopup.setSubmitAction(() => {
    deleteCardPopup.setLoading(true);
    api
      .deleteCard(card.getId())
      .then(() => {
        card.remove();
        deleteCardPopup.close();
      })
      .catch(console.error)
      .finally(() => {
        deleteCardPopup.setLoading(false, "Yes");
      });
  });
}

function createCard({ name, link, isLiked, _id, userId, ownerId }) {
  const cardElement = new Card(
    { name, link, isLiked, _id, userId, ownerId },
    userID,
    "#card-template",
    handleCardClick,
    handleDeleteClick,
    handleLikeClick
  );
  return cardElement.getView();
}
// =============================================================================
// Preview Popup
// =============================================================================

const previewImagePopup = new PopupWithImage({
  popupSelector: "#preview-modal",
});
previewImagePopup.setEventListeners();

// =============================================================================
// Profile Popup
// =============================================================================

const profilePopup = new PopupWithForm({
  popupSelector: "#profile-edit-modal",
  handleFormSubmit: (inputValues) => {
    profilePopup.showLoading();
    api
      .editProfile(inputValues)
      .then(() => {
        userInfo.setUserInfo(inputValues);
        profilePopup.close();
      })
      .catch(console.error)
      .finally(() => {
        profilePopup.hideLoading();
      });
  },
  loadingButtonText: "Saving...",
});

profilePopup.setEventListener();

profileEditButton.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();
  modalTitleInput.value = userData.name;
  modalDescriptionInput.value = userData.about;
  profilePopup.open();
});

// =============================================================================
// Validation
// =============================================================================

const addFormValidator = new FormValidator(formValidationConfig, addCardForm);
addFormValidator.enableValidation();

const editFormValidator = new FormValidator(
  formValidationConfig,
  profileEditForm
);

const avatarEditModal = document.querySelector("#edit-avatar-modal");
const avatarEditForm = avatarEditModal.querySelector(".modal__form");

const editAvatarValidator = new FormValidator(
  formValidationConfig,
  avatarEditForm
);

editFormValidator.enableValidation();
editAvatarValidator.enableValidation();

export { previewImage, previewFooter, previewImageModal };

// =============================================================================
// Add Card Popup
// =============================================================================

const addCardPopup = new PopupWithForm({
  popupSelector: "#add-card-modal",
  handleFormSubmit: (inputValues) => {
    addCardPopup.showLoading();
    api
      .addNewCard(inputValues)
      .then((card) => {
        const newCard = createCard(card);
        cardList.prependItem(newCard);
        addCardPopup.close();
      })
      .catch(console.error)
      .finally(() => {
        addCardPopup.hideLoading();
      });
  },
  loadingButtonText: "Saving...",
});

addCardPopup.close();
addCardPopup.setEventListener();

profileAddButton.addEventListener("click", () => {
  addFormValidator.resetValidation();
  addCardPopup.open();
});

// =============================================================================
// Profile Avatar
// =============================================================================

const avatarEditButton = document.querySelector(".profile__image-overlay");
const profileAvatar = document.querySelector("#profile-avatar");

const editAvatarPopup = new PopupWithForm({
  popupSelector: "#edit-avatar-modal",
  handleFormSubmit: (inputValues) => {
    editAvatarPopup.showLoading();
    api
      .updateProfilePicture(inputValues)
      .then((res) => {
        userInfo.setUserInfo(res);
        editAvatarPopup.close();
      })
      .catch(console.error)
      .finally(() => {
        editAvatarPopup.hideLoading();
      });
  },
  loadingButtonText: "Saving...",
});

editAvatarPopup.close();
editAvatarPopup.setEventListener();

avatarEditButton.addEventListener("click", () => {
  editAvatarValidator.resetValidation();
  editAvatarPopup.open();
});
