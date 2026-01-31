import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import IconArrowLeft from "/src/assets/svg/arrow-left.svg";

const ProfileDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <section className="section section--top section--cover">
            <div className="account">
                <header className="navigation-bar">
                    <button 
                        className="navigation-bar__left" 
                        type="button" 
                        onClick={() => navigate(-1)}
                    >
                        <img src={IconArrowLeft} alt="Close" />
                    </button>

                    <h1 className="navigation-bar__center body-semi-bold">
                        Datos personales
                    </h1>
                </header>

                <div className="form__page form__page--inner form__page--account-info">
                    <div className="form__container form__container--inner form-personal-data">
                        <div className="wrapper" data-id="login-page-heading-wrapper">
                            <div>
                                <button type="button" className="button" data-id="back-icon">
                                    <svg-image 
                                        glyph="back_ios" 
                                        width="24px" 
                                        height="24px" 
                                        fill="var(--icon-main)" 
                                        data-id="back-button-icon" 
                                        style={{ width: "24px", height: "24px" }}
                                    ></svg-image>
                                </button>
                            </div>
                            <div className="right"></div>
                        </div>
                        
                        <div className="form__wrapper">
                            <form>
                                <div className="form__control">
                                    <div className="form__field">
                                        <input 
                                            type="tel" 
                                            className="form__input" 
                                            name="phone" 
                                            autoComplete="tel" 
                                            disabled
                                            defaultValue={contextData?.session?.user?.phone || "-"} 
                                        />
                                        <label className="form__label active">Teléfono</label>
                                    </div>
                                </div>
                                
                                <div className="form__control">
                                    <div className="form__field">
                                        <input 
                                            className="form__input" 
                                            name="email" 
                                            autoComplete="email" 
                                            disabled 
                                            defaultValue={contextData?.session?.user?.email || "-"} 
                                        />
                                        <label className="form__label active">Correo electrónico</label>
                                    </div>
                                </div>

                                <div className="form__control">
                                    <div className="form__field">
                                        <input 
                                            className="form__input" 
                                            name="username" 
                                            autoComplete="username" 
                                            disabled 
                                            defaultValue={contextData?.session?.user?.username || "-"} 
                                        />
                                        <label className="form__label active">Nombre</label>
                                    </div>
                                </div>

                                <div className="form__control">
                                    <div className="form__field">
                                        <input 
                                            className="form__input" 
                                            name="lastName" 
                                            autoComplete="lastName" 
                                            disabled 
                                            defaultValue={contextData?.session?.user?.last_name || "-"} 
                                        />
                                        <label className="form__label active">Apellido</label>
                                    </div>
                                </div>
                                
                                <div className="form__control">
                                    <div className="form__field">
                                        <input 
                                            className="form__input" 
                                            placeholder="DD.MM.YYYY" 
                                            disabled
                                            defaultValue={contextData?.session?.user?.birthday || "-"}
                                        />
                                        <label className="form__label active">Fetha de Nacimiento</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileDetail;