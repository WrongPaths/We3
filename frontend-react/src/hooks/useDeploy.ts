import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

export function useDeploy() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployTx, setDeployTx] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  const deploy = useCallback(async (signer: ethers.Signer, abi: any[], bytecode: string): Promise<string | null> => {
    setIsDeploying(true);
    setDeployError(null);
    setDeployTx(null);
    try {
      const factory = new ethers.ContractFactory(abi, bytecode, signer);
      const contract = await factory.deploy();
      setDeployTx(contract.deploymentTransaction()!.hash);

      await contract.waitForDeployment();
      const address = await contract.getAddress();
      return address;
    } catch (err: any) {
      setDeployError(err.message || 'Deployment failed');
      return null;
    } finally {
      setIsDeploying(false);
    }
  }, []);

  return { deploy, isDeploying, deployTx, deployError };
}
