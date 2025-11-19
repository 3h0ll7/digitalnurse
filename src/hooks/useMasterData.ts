import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export type MasterDataType = "procedures" | "labs" | "drugs" | "assessments";

export interface MasterDataRecord<TContent = Record<string, unknown>> {
  id: string;
  type: MasterDataType;
  name: string;
  category?: string;
  summary?: string;
  content?: TContent;
}

interface MasterDataResponse<TContent> {
  resource: MasterDataType;
  records: MasterDataRecord<TContent>[];
}

export const useMasterData = <TContent = Record<string, unknown>>(type: MasterDataType) => {
  const { secureRequest, user } = useAuth();
  return useQuery<MasterDataResponse<TContent>>({
    queryKey: ["master-data", type, user?.id],
    queryFn: () => secureRequest<MasterDataResponse<TContent>>(`/api/master-data/${type}`),
    enabled: Boolean(user),
    staleTime: 5 * 60 * 1000,
  });
};
