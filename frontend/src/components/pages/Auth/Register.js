import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import Input from '../../form/Input'

import styles from '../../form/Form.module.css'

/* Context */
import { Context } from '../../../context/UserContext'

function Register() {
    const [user, setUser] = useState({})
    const { register } = useContext(Context)

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        //enviar um user para o banco
        register(user)
    }

    return (
        <section className={styles.form_container}>
            <h1>Registrar</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite seu nome"
                    handleOnChange={handleChange}
                />

                <Input
                    text="telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite seu telefone"
                    handleOnChange={handleChange}
                />

                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite seu e-mail"
                    handleOnChange={handleChange}
                />

                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnChange={handleChange}
                />

                <Input
                    text="Confirmação de senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Digite novamente a sua senha"
                    handleOnChange={handleChange}
                />

                <input type="submit" value="Cadastrar" />
                <p>

                    Já tem conta? <Link to="/login">Clique aqui.</Link>
                </p>
            </form>
        </section>
    )
}

export default Register