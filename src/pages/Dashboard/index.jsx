import Card from "../../components/ui/Card";

export default function Dashboard() {

  return (

    <>

      <h1 className="text-3xl font-bold mb-8">

        Přehled

      </h1>

      <div className="grid grid-cols-4 gap-6">

        <Card title="Rodiny" value="4" />

        <Card title="Návštěvy" value="15" />

        <Card title="Brigády" value="42 h" />

        <Card title="Pokladna" value="25 430 Kč" />

      </div>

    </>

  );

}