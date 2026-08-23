const ConfirmEmailPage = () => {
  return (
    <div className="w-full flex flex-col text-center items-center  justify-center">
      <h1 className="text-xl text-[#4F8A69] font-semibold mb-4">
        Bievenue sur Nidoo{" "}
      </h1>
      <p>
        Afin d'accéder a votre dashboard, veuillez confirmer votre adresse en
        cliquant sur le lien reçu dans votre boite mail.
      </p>
      <p className="font-semibold">
        Si vous ne trouvez pas le mail, vérifier vos spams{" "}
      </p>
    </div>
  );
};

export default ConfirmEmailPage;
