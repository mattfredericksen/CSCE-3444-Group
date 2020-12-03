import React, {useCallback, useEffect, useRef, useState} from "react";
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

    const email = useRef("");
    const setEmail = useCallback(
        (event) => email.current = event.target.value,
        []
    );

    const submitHandler = useCallback(
        (event) => {
            event.preventDefault();
            axios.put(api + 'email/', {email: email.current})
                .then(res => console.log(res))
                .catch(e => {
                    // perform some alerting here
                    console.error(e);
                });
        }, []
    );

    return (
        <form style={divStyle} onSubmit={submitHandler}>
            <h3 style={divStyle}>
                {"Please enter name and email address to add."}
            </h3>
            <input type={"email"} name={"email"} onChange={setEmail}
                   placeholder={placeholder}/>
            <br />
            <input type={"submit"} value={"Submit"}/>
        </form>
    );
}

