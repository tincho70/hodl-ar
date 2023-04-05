import Modal from "@/components/shared/Modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";

const RegisterSubdomainModal = ({
  showDemoModal,
  setShowDemoModal,
}: {
  showDemoModal: boolean;
  setShowDemoModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>();

  const signUpUser = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);
    const githubUsername = e.target.githubUsername.value;
    const res = await fetch("/api/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        github: githubUsername,
      }),
    });

    //

    fetch("/api/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        github: githubUsername,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.info("data:");
        console.dir(data);

        if (
          data.success &&
          data.data.lndhub?.login &&
          data.data.lndhub?.password &&
          data.data.lndhub?.url
        ) {
          setIsLoading(false);
          next({
            ...data.data,
          });
        } else {
          console.error(data);
          setIsLoading(false);
          alert("Tremendo error");
        }
      })
      .catch((e) => {
        console.error(e);
        alert("Catch error");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const next = async (data: any) => {
    setUserData(data);

    console.info("user data:");
    console.dir(data);

    alert("Usuario creado con éxito!");
  };

  return (
    <Modal showModal={showDemoModal} setShowModal={setShowDemoModal}>
      <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-display text-2xl font-bold">HODL.ar</h3>
          <div className="text-sm text-gray-500">
            {userData ? (
              <div>
                <h1>Datos de Usuario</h1>
                <div>
                  <div>Usuario: </div>
                  <div>LNURL: {userData.lnAddress}</div>

                  <h2>LndHub</h2>
                  <div>Username: {userData.lndhub.login}</div>
                  <div>Password: {userData.lndhub.password}</div>
                  <div>Url: {userData.lndhub.url}</div>

                  <div>
                    <a
                      href={userData.walletUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 w-full rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                    >
                      Ir a Wallet
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={signUpUser}>
                <div>
                  github.com/
                  <input
                    type="text"
                    placeholder="Usuario de Github"
                    name="githubUsername"
                    id="githubUsername"
                    disabled={isLoading}
                  />
                </div>

                {isLoading ? (
                  "Cargando..."
                ) : (
                  <button className="mt-5 w-full rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black">
                    Conectar
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export function useDemoModal() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const DemoModalCallback = useCallback(() => {
    return (
      <RegisterSubdomainModal
        showDemoModal={showDemoModal}
        setShowDemoModal={setShowDemoModal}
      />
    );
  }, [showDemoModal, setShowDemoModal]);

  return useMemo(
    () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
    [setShowDemoModal, DemoModalCallback],
  );
}
