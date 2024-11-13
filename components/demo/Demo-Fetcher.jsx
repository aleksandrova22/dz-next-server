import { useState } from "react";
import useSWR from 'swr';
import toast from 'react-hot-toast';
import OneUser from '../OneUser';
import classes from './DemoFetcher.module.css';
import ErrorInfo from '../Error';


const
    API_URL = 'http://localhost:3333/users',
    DELETE = 'del',
    ADD = 'add',
    EDIT = 'edit',
    fetcher = async () => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('fetch ' + response.status);
        return await response.json();
    },
    infoFetcher = async () => {
        const pr = fetcher();
        toast.promise(pr, {
            loading: 'Fetcher ',
            success: 'ok',
            error: (err) => `${err.toString()}`
        });
        return await pr;
    };


export function DemoFetcher() {
    const
        [name, setName] = useState(''),
        [username, setUsername] = useState(''),
        [phone, setPhone] = useState(''),
        [email, setEmail] = useState(''),
        [website, setWebsite] = useState(''),
        newUser = { name, username, email, phone, website, address: { geo: {} }, company: {} },
        { data, error, isLoading, isValidating, mutate } = useSWR(API_URL, infoFetcher, { revalidateOnFocus: false }),
        onClick = async (event) => {
            const
                action = event.target.closest('[data-action]')?.dataset?.action,
                id = event.target.closest('[data-id]')?.dataset?.id;
            //console.log('onClick', { action, id });
            if (!action) return;
            let
                optimisticData;
            const
                getPromise = () => {
                    //если нажата удалить
                    switch (action) {
                        case DELETE:
                            optimisticData = data.filter(el => { el.id !== id });
                            return fetch(API_URL + '/' + id, { method: 'DELETE' }).then(res => {
                                if (!res.ok) { throw (new Error(res.status + res.statusText)) }
                            });
                        //если нажата добавить
                        case ADD:
                            const
                                optimisticData = data.concat(newUser);
                            //console.log(newUser);
                            return fetch(API_URL, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newUser)}).then(res => {
                                if (!res.ok) { throw (new Error(res.status + ' ' + res.statusText)) }
                            });
                            case EDIT:
                                {console.log('в работе');}
                    }},

                promise = getPromise();
            if (promise) {
                toast.promise(promise, {
                    loading: '...Loading!' + action,
                    success: 'Ok!',
                    error: 'Error!',
                });
                await mutate(promise.then(() => optimisticData, () => fetcher()));
            }
        };

    return <>
        <div style={{ position: 'absolute', fontSize: 'xxx-large' }}>
            {isLoading && '👀..Loading'}
            {isValidating && '✅Ok'}
        </div>
       
        {error && <ErrorInfo error={error} />}
        <div onClick={onClick} className={classes.usercard}>
            <form onSubmit={(event) => event.preventDefault()} data-form={'form'} >
                Name <input type="text" value={name} onInput={event => setName(event.target.value)} />
                Username <input type="text" value={username} onInput={event => setUsername(event.target.value)} />
                Phone <input type="phone" value={phone} onInput={event => setPhone(+event.target.value)} />
                Email <input type="email" value={email} onInput={event => setEmail(event.target.value)} />
                Website <input type="text" value={website} onInput={event => setWebsite(event.target.value)} />
               
                <button type="submit" data-action={ADD}> ➕ ADD</button>
            </form>
            {data && data.map(user => (user) && (<OneUser user={user} key={user.id} />))}
           
        </div>
    </>

}



