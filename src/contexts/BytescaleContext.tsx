'use client';

import { BytescaleConfig } from '@/lib/bytescale';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface BytescaleContextType {
    config: BytescaleConfig | null;
    isConfigured: boolean;
    isDemoMode: boolean;
}

const BytescaleContext = createContext<BytescaleContextType | undefined>(undefined);

export function useBytescaleContext() {
    const context = useContext(BytescaleContext);
    if (context === undefined) {
        throw new Error('useBytescaleContext must be used within a BytescaleProvider');
    }
    return context;
}

interface BytescaleProviderProps {
    children: React.ReactNode;
}

export function BytescaleProvider({ children }: BytescaleProviderProps) {
    const [config, setConfig] = useState<BytescaleConfig | null>(null);
    const [isConfigured, setIsConfigured] = useState(false);

    useEffect(() => {
        // Initialize Bytescale configuration from environment variables
        const apiKey = process.env.NEXT_PUBLIC_BYTESCALE_API_KEY;

        if (apiKey) {
            const bytescaleConfig: BytescaleConfig = {
                apiKey,
                folder: process.env.NEXT_PUBLIC_BYTESCALE_FOLDER || '',
            };

            setConfig(bytescaleConfig);
            setIsConfigured(true);
            console.log('Bytescale configured successfully');
        } else {
            console.warn('Bytescale API key not found. Demo mode will be used.');
            setConfig(null);
            setIsConfigured(false);
        }
    }, []);

    const isDemoMode = !isConfigured;

    return (
        <BytescaleContext.Provider
            value={{
                config,
                isConfigured,
                isDemoMode,
            }}
        >
            {children}
        </BytescaleContext.Provider>
    );
}
