import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import LoadApi from "../components/Loading/LoadApi";
import ImgLogin from "/src/assets/img/login-background.webp";

const Login = () => {
    const { contextData, updateSession } = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setIsLoading(true);
        setErrorMsg("");

        let body = {
            username: username,
            password: password,
            site_label: "main",
        };

        callApi(
            contextData,
            "POST",
            "/login",
            callbackSubmitLogin,
            JSON.stringify(body)
        );
    };

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);
        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);

            setTimeout(() => {
                navigate(-1);
            }, 1000);
        } else if (result.status === "country") {
            setErrorMsg(result.message);
        } else {
            setErrorMsg("Nombre de usuario y contraseña no válidos");
        }
    };

    useEffect(() => {
        const passwordInput = document.getElementById("password");
        if (passwordInput) {
            passwordInput.setAttribute("type", showPassword ? "text" : "password");
        }
    }, [showPassword]);

    return (
        <div className="auth-layout">
            <div className="auth-layout__content-box">
                <div className="auth-layout__header auth-layout__header--large">
                    <app-auth-header formtype="login">
                        <div className="auth-header auth-header--large">
                            <img className="auth-header__background" alt="background-image" src={ImgLogin} />
                            <div className="auth-header__close auth-header__close--banner" onClick={() => navigate("/")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor"><path d="M13.4 12l4.8-4.8c.4-.4.4-1 0-1.4s-1-.4-1.4 0L12 10.6 7.2 5.8c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l4.8 4.8-4.8 4.8c-.4.4-.4 1 0 1.4s1 .4 1.4 0l4.8-4.8 4.8 4.8c.4.4 1 .4 1.4 0s.4-1 0-1.4L13.4 12z"></path></svg>
                            </div>
                        </div>
                    </app-auth-header>
                </div>
                <div className="auth-layout__body auth-layout__body--rounded">
                    <div className="auth-layout__container">
                        <fieldset className={`text-field ${errorMsg ? 'text-field--error' : ''}`}>
                            <input
                                autoComplete="username"
                                className="text-field__input"
                                type="text"
                                name="username"
                                id="username"
                                aria-required="true"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={() => setUsernameFocused(true)}
                                onBlur={() => setUsernameFocused(false)}
                                disabled={isLoading}
                            />
                            <label
                                className={`text-field__label ${usernameFocused || username ? 'text-field__label--active' : ''}`}
                                htmlFor="username"
                            >
                                Nombre de usuario
                            </label>
                        </fieldset>

                        <fieldset className={`text-field ${errorMsg ? 'text-field--error' : ''}`}>
                            <input
                                autoComplete="current-password"
                                className="text-field__input"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                aria-required="true"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                disabled={isLoading}
                            />
                            <label
                                className={`text-field__label ${passwordFocused || password ? 'text-field__label--active' : ''}`}
                                htmlFor="password"
                            >
                                Contraseña
                            </label>
                            <button
                                className="text-field__button text-field__append"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                                        <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
                                        <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
                                        <path d="M3 3l18 18"></path>
                                    </svg>
                                )}
                            </button>
                            {errorMsg && (
                                <p className="text-field__message">
                                    {errorMsg}
                                </p>
                            )}
                        </fieldset>

                        <button
                            className="button button--regular button--primary"
                            type="button"
                            onClick={handleSubmit}
                        >
                            <span className="flex align-items-center gap-3">Iniciar sesión {isLoading && <LoadApi />} </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;