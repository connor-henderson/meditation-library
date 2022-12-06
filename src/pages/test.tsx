const T = () => {
  const getRes = async () => {
    const res = await fetch("http://localhost:3000/");
    console.log(await res.text());
    console.log("mes");
    console.log("mes");
    // console.log(mes);
  };
  getRes();
  return <h1>test</h1>;
};

export default T;
