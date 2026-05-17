import { ethers } from 'ethers';
import { useState, useEffect, useCallback, useRef } from 'react';

const MAX_LOGS = 50;

export interface TxLogEntry {
  time: string;
  type: 'GET' | 'SET' | 'DEMO' | 'CONNECT';
  data: string;
  hash?: string;
}

export function useContract(signer: ethers.Signer | null, connected: boolean, abi: any[], contractAddress?: string) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [storedValue, setStoredValue] = useState<string>('-');
  const [logs, setLogs] = useState<TxLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasContract = !!contractAddress;

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const addLog = useCallback((type: TxLogEntry['type'], data: string, hash?: string) => {
    const entry: TxLogEntry = {
      time: new Date().toLocaleTimeString(),
      type,
      data,
      hash
    };
    setLogs(prev => {
      const newLogs = [entry, ...prev];
      return newLogs.slice(0, MAX_LOGS);
    });
  }, []);

  useEffect(() => {
    if (signer && connected && contractAddress) {
      const c = new ethers.Contract(contractAddress, abi, signer);
      setContract(c);
      addLog('CONNECT', `Contract at ${contractAddress.slice(0, 10)}...`);
    } else {
      setContract(null);
    }
  }, [signer, connected, contractAddress, abi, addLog]);

  const getValue = useCallback(async () => {
    if (!contract || !isMountedRef.current) return;
    setIsLoading(true);
    setError(null);
    try {
      const value = await contract.get();
      if (isMountedRef.current) {
        setStoredValue(value.toString());
        addLog('GET', `storedData = ${value.toString()}`);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [contract, addLog]);

  const setValue = useCallback(async (value: string) => {
    if (!contract || !isMountedRef.current) return;
    setIsLoading(true);
    setError(null);
    try {
      const tx = await contract.set(BigInt(value));
      addLog('SET', `set(${value})`, tx.hash);
      await tx.wait();
      const newValue = await contract.get();
      if (isMountedRef.current) {
        setStoredValue(newValue.toString());
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [contract, addLog]);

  return { storedValue, logs, isLoading, error, getValue, setValue, addLog, hasContract };
}
