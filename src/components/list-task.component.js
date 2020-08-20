import React from "react";
import {
  WAITING_FOR_ACCEPT,
  ACCEPTED,
  DECLINED,
  NOT_STARTED_YET,
  ON_GOING,
  OVERDUE,
  COMMITED,
  FINISHED_CONFIRMED,
  CANNOT_FINISH_CONFIRMED
} from "../config/constants";
import { List, ListItem, Icon } from "@ui-kitten/components";

export const PaperListStatus = ({ data, navigation, userName }) => {
  const ForwardIcon = () => (
    <Icon name="arrow-ios-forward" width={20} height={20} fill="#8F9BB3" />
  );

  const renderItem = ({ item }) => {
    switch (item.status) {
      case WAITING_FOR_ACCEPT:
        return (
          <ListItem
            title={item.name}
            description={"• Waiting for Approval"}
            descriptionStyle={{ color: "#B7771A" }}
            onPress={() => navigation.navigate("Detail", { taskId: item.id })}
            accessory={ForwardIcon}
          />
        );
      case DECLINED:
        return (
          <ListItem
            title={item.name}
            description={"• Declined"}
            descriptionStyle={{ color: "#FF4830" }}
            onPress={() => navigation.navigate("Detail", { taskId: item.id })}
            accessory={ForwardIcon}
          />
        );
      case NOT_STARTED_YET:
        return (
          <ListItem
            title={item.name}
            description={"• Not Started Yet"}
            descriptionStyle={{ color: "#8F9BB3" }}
            onPress={() => navigation.navigate("Detail", { taskId: item.id })}
            accessory={ForwardIcon}
          />
        );
      case ON_GOING:
        return (
          <ListItem
            title={item.name}
            description={"• On-going"}
            descriptionStyle={{ color: "#3366FF" }}
            onPress={() =>
              navigation.navigate("Detail", {
                taskId: item.id,
                userName: userName
              })
            }
            accessory={ForwardIcon}
          />
        );
      case COMMITED:
        return (
          <ListItem
            title={item.name}
            description={"• Commited"}
            descriptionStyle={{ color: "#FFBB35" }}
            onPress={() =>
              navigation.navigate("Detail", {
                taskId: item.id,
                userName: userName
              })
            }
            accessory={ForwardIcon}
          />
        );
      case FINISHED_CONFIRMED:
        return (
          <ListItem
            title={item.name}
            description={"• Finished"}
            descriptionStyle={{ color: "#7DC914" }}
            onPress={() => navigation.navigate("Detail", { taskId: item.id })}
            accessory={ForwardIcon}
          />
        );
      case CANNOT_FINISH_CONFIRMED:
        return (
          <ListItem
            title={item.name}
            description={"• Cannot Finish"}
            descriptionStyle={{ color: "#FFAB88" }}
            onPress={() => navigation.navigate("Detail", { taskId: item.id })}
            accessory={ForwardIcon}
          />
        );
      case OVERDUE:
        return (
          <ListItem
            title={item.name}
            description={"• Overdue"}
            descriptionStyle={{ color: "#B7181F" }}
            onPress={() => navigation.navigate("Detail", { taskId: item.id })}
            accessory={ForwardIcon}
          />
        );
      default:
        console.log(item.status);
        return <></>;
    }
  };

  return <List data={data} renderItem={renderItem} />;
};
