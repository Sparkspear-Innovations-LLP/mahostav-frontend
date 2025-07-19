'use client';

import { initializeSpaces, SpacesConfig } from '@/lib/digitalocean-spaces';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SpacesContextType {
    isInitialized: boolean;
    config: SpacesConfig | null;
    initializeWithConfig: (config: SpacesConfig) => void;
    error: string | null;
}

const SpacesContext = createContext<SpacesContextType | undefined>(undefined);

interface SpacesProviderProps {
    children: React.ReactNode;
    autoInitialize?: boolean;
}

export function SpacesProvider({ children, autoInitialize = true }: SpacesProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [config, setConfig] = useState<SpacesConfig | null>(null);
    const [error, setError] = useState<string | null>(null);

    const initializeWithConfig = (newConfig: SpacesConfig) => {
        try {
            initializeSpaces(newConfig);
            setConfig(newConfig);
            setIsInitialized(true);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to initialize Spaces');
            setIsInitialized(false);
        }
    };

    useEffect(() => {
        if (autoInitialize && typeof window !== 'undefined') {
            // Try to initialize with environment variables
            const envConfig: SpacesConfig = {
                endpoint: process.env.NEXT_PUBLIC_DO_SPACES_ENDPOINT || '',
                accessKeyId: process.env.NEXT_PUBLIC_DO_SPACES_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.NEXT_PUBLIC_DO_SPACES_SECRET_ACCESS_KEY || '',
                bucketName: process.env.NEXT_PUBLIC_DO_SPACES_DEFAULT_BUCKET || '',
                region: process.env.NEXT_PUBLIC_DO_SPACES_REGION || 'nyc3',
            };

            // Only initialize if all required fields are present
            if (envConfig.endpoint && envConfig.accessKeyId && envConfig.secretAccessKey) {
                initializeWithConfig(envConfig);
            } else {
                // For demo purposes, initialize with placeholder config
                console.warn('DigitalOcean Spaces environment variables not found. Using demo configuration.');
                const demoConfig: SpacesConfig = {
                    endpoint: 'https://nyc3.digitaloceanspaces.com',
                    accessKeyId: 'demo_access_key',
                    secretAccessKey: 'demo_secret_key',
                    bucketName: 'demo-bucket',
                    region: 'nyc3',
                };
                initializeWithConfig(demoConfig);
            }
        }
    }, [autoInitialize]);

    return (
        <SpacesContext.Provider value={{ isInitialized, config, initializeWithConfig, error }}>
            {children}
        </SpacesContext.Provider>
    );
}

export function useSpaces() {
    const context = useContext(SpacesContext);
    if (context === undefined) {
        throw new Error('useSpaces must be used within a SpacesProvider');
    }
    return context;
}
