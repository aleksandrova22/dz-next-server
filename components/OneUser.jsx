export default function OneUser({ user }) {
  const {
    id, name, username, email,
    address: { street, suite, city, zipcode, geo: { lat, lng } },
    phone, website,
    company: {
      name: cname,
      catchPhrase,
      bs
    }
  } = user,
    DELETE = 'del',
    EDIT = 'edit';

  return (<>
    <fieldset>
      <legend>#{id} {username}</legend>
      <h3>{name}</h3>
      <span> 📧<a href={`mailto:${email}`}>{email}</a></span>
      <p><span>📞<a href={`tel:${phone}`}>{phone}</a></span></p>
      <p> <span>🌐<a href={`http://${website}`}>{website}</a></span></p>
      <span title={zipcode}><b><a href={`https://maps.google.com/maps?ll=${lat},${lng}`}>{street} {suite} {city}</a></b></span>
      <span><b>{cname}</b><br />{catchPhrase}<br />{bs}</span>
      <hr />
      <button data-action={DELETE} data-id={id}>❌ DEL</button>
      {/* <button data-action={EDIT} data-id={id}>🖍 Edit</button> */}
    </fieldset>
  </>);
}
