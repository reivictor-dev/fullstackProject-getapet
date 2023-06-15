import React, { useState, useContext } from 'react'
import Input from '../../form/Input'
import { Link } from 'react-router-dom'
import Styles from '../../form/Form.module.css'

/*context */
import { Context } from '../../../context/UserContext'

function Login() {

    const [user, setUser] = useState({})
    const { login } = useContext(Context) //importacao

    function handleChange(e) {
        setUser({
            ...user, [e.target.name]: e.target.value
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        login(user)
    }

    return (
        <section className={Styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite o seu e-mail"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite sua senha"
                    handleOnChange={handleChange}
                />
                <input type="submit" value="Entrar" />
            </form>
            <p>
                Não tem conta? <Link to="/register"></Link>
            </p>
        </section>
    )
}

export default Login