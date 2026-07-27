import { Building, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../../app/components/ui/badge";
import { Button } from "../../../app/components/ui/button";

export function BankInformation({ profile }) {
  const [showFullAccount, setShowFullAccount] = useState(false);

  if (!profile) return null;

  const rawAccount = profile.BankAccountNumber || "";
  const maskedAccount = profile.MaskedBankAccountNumber || (rawAccount ? `•••• •••• ${rawAccount.slice(-4)}` : "Not Provided");
  const displayAccount = showFullAccount && rawAccount ? rawAccount : maskedAccount;

  const bankList = [
    { label: "Bank Name", value: profile.BankName || "Not Provided" },
    { label: "Account Holder", value: profile.BankAccountHolder || profile.FullName },
    { label: "Account Number", value: displayAccount, isAccount: true },
    { label: "IFSC Code", value: profile.BankIFSC || "Not Provided" },
    { label: "Branch Name", value: profile.BankBranch || "Not Provided" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
          <Building className="w-4 h-4 text-primary" /> Bank & Salary Direct Deposit Account
        </h3>
        <Badge variant="outline" className="text-[10px] gap-1 text-muted-foreground">
          <Lock className="w-3 h-3" /> Secure Record
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {bankList.map((item, idx) => (
          <div key={idx} className="p-3 bg-accent/30 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
              {item.isAccount && rawAccount && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowFullAccount(!showFullAccount)}
                  title={showFullAccount ? "Mask Account Number" : "Reveal Account Number"}
                >
                  {showFullAccount ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
              )}
            </div>
            <p className="font-medium text-foreground mt-0.5 tracking-wide">{item.value || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
