import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

export default class UserProfileController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.model = this.setModel({
            userDetails: {
                username: 'John',
                email: 'john.doe@example.com',
                avatar: "assets/images/user.png"
            }
        });

        let globalContainer = element.parentElement.parentElement;
        let appRoot = globalContainer.parentElement;

        const mobileCallback = () => {
            if (appRoot.classList.contains('is-mobile')) {
                this.model.renderer = 'mobile-profile-renderer';
                globalContainer.classList.add('is-mobile');
            } else {
                this.model.renderer = 'psk-user-profile-renderer';
                globalContainer.classList.remove('is-mobile');
            }
        }

        mobileCallback();
        window.addEventListener('resize', mobileCallback);
    }
}