import React, {useCallback, useEffect, useState} from "react";
import {useStateWithEvent} from "./CustomHooks";
import axios from 'axios';

const api = "http://dodc:5000/"

const divStyle = {
    color: '#ffffff',
    textAlign: "center",
};

export default function Settings() {
    const [placeholder, setPlaceholder] = useState("Enter Email");
    useEffect(() => {
        fetch(api + 'email/')
            .then(res => res.json())
            .then(({email}) => {if (email) setPlaceholder(email)})
            .catch(error => console.error(error));
    }, []);

    const [email, setEmail] = useStateWithEvent("");

    const submitHandler = useCallback(
        (event) => {
            event.preventDefault();
            axios.put(api + 'email/', {email: email})
                .then(({request: {response}}) => {
                    setEmail({target: {value: ""}});
                    setPlaceholder(JSON.parse(response)['email']);
                    alert("Success");
                })
                .catch(err => {
                    console.error(err);
                    if (err.response) {
                        alert(JSON.stringify(err.response.data, null, 2))
                    }
                });
        }, [email, setEmail]
    );

    return (
        <form style={divStyle} onSubmit={submitHandler}>
            <h3 style={divStyle}>
                {"Enter email for AlertManager configuration."}
            </h3>
            <input type={"email"} name={"email"} onChange={setEmail}
                   value={email} placeholder={placeholder}
                   style={{width: "300px"}}/>
            <br />
            <input type={"submit"} value={"Submit"}/>
        </form>
    );
}

