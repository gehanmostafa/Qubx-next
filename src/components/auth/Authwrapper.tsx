interface IAuthWrapperProps {
  title: string;
  children: React.ReactNode;
}
const Authwrapper = ({ title, children }: IAuthWrapperProps) => {
  return (
    <div className="min-h-screen bg-[url('/images/bg-login.png')] bg-cover bg-no-repeat">
      <div className="w-full md:w-11/12 mx-auto p-2">
        <div className="w-80 h-25">
          <img src="/images/logo.png" alt="QUBX3D Logo" />
        </div>
        <div className="flex justify-between flex-col-reverse lg:flex-row items-center px-20 md:px-2">
          <div className="bg-background rounded-md shadow-2xl p-4 md:p-8 w-full md:w-3xl h-fit">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 text-primary">
                {title}
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Empowering surgeons with AI-powered 3D technology.
              </p>
            </div>
            {children}
          </div>

          <div className="lg:mt-12">
            <img
              src="/images/loginImage.gif"
              alt="Human 3D Model"
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authwrapper;
